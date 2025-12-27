import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { getRolesFromJwt } from "../../../utils/jwt";

import {
    PencilLine,
    Trash2,
    ShoppingCart,
    Check,
    X,
    ImagePlus,
    Ban,
} from "lucide-react";

import {
    updateProduct,
    deleteProduct,
    toggleProductStatus,
} from "../../../features/api/productAction";

import type { Product } from "../../../utils/types/product.ts";

type Props = {
    product: Product;
    onSavedLocal?: (p: Product) => void;
    onDeletedLocal?: () => void;
    onAddToCart?: () => void;
    onBlockedLocal?: () => void;
};

export default function RowProductsTable({
                                             product,
                                             onSavedLocal,
                                             onDeletedLocal,
                                             onAddToCart,
                                             onBlockedLocal,
                                         }: Props) {
    const token = useSelector((s: RootState) => s.token.accessToken);
    const roles = token ? getRolesFromJwt(token) : [];
    const canModerate =
        roles.includes("MODERATOR") || roles.includes("ADMINISTRATOR");

    const initialImg = product.imageUrl ?? "";

    const categoryText = useMemo(
        () =>
            typeof product.category === "string"
                ? product.category
                : product.category?.name ?? "",
        [product.category]
    );

    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price ?? 0);
    const [qty, setQty] = useState(product.quantity ?? 0);
    const [desc, setDesc] = useState(product.description ?? "");
    const [imgPreview, setImgPreview] = useState(initialImg);
    const [file, setFile] = useState<File | null>(null);

    const cancelEdit = () => {
        setEdit(false);
        setName(product.name);
        setPrice(product.price ?? 0);
        setQty(product.quantity ?? 0);
        setDesc(product.description ?? "");
        setImgPreview(initialImg);
        setFile(null);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        if (f) setImgPreview(URL.createObjectURL(f));
    };

    const save = async () => {
        setSaving(true);
        try {
            const updated = await updateProduct({
                id: product.id,
                name: name.trim(),
                price,
                quantity: qty,
                description: desc.trim(),
                imageUrl: file ? undefined : imgPreview,
                newImageFile: file ?? undefined,
                newImageFileName: product.id,
                category: product.category,
            });

            onSavedLocal?.(
                updated ?? {
                    ...product,
                    name: name.trim(),
                    price,
                    quantity: qty,
                    description: desc.trim(),
                    imageUrl: imgPreview,
                }
            );

            setEdit(false);
            setFile(null);
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        if (!confirm(`Delete "${product.name}"?`)) return;
        setRemoving(true);
        try {
            await deleteProduct(product.id);
            onDeletedLocal?.();
        } finally {
            setRemoving(false);
        }
    };

    const blockProduct = async () => {
        await toggleProductStatus(product.id, true);
        onBlockedLocal?.();
    };

    return (
        <tr className="align-top">
            <td className="pl-2 py-2">
                <div className="flex items-center gap-2">
                    {imgPreview ? (
                        <img
                            src={imgPreview}
                            alt={name}
                            className="h-14 w-14 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-14 w-14 rounded-full bg-gray-200" />
                    )}
                    {edit && (
                        <label className="action-icon">
                            <ImagePlus className="h-4 w-4" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onFileChange}
                            />
                        </label>
                    )}
                </div>
            </td>

            <td className="pl-2 py-2">
                {edit ? (
                    <input
                        className="inputFieldTable w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    product.name
                )}
            </td>

            <td className="pl-2 py-2">{categoryText}</td>

            <td className="pl-2 py-2">
                {edit ? (
                    <input
                        type="number"
                        className="inputFieldTable w-20"
                        value={qty}
                        onChange={(e) => setQty(+e.target.value || 0)}
                    />
                ) : (
                    product.quantity ?? 0
                )}
            </td>

            <td className="pl-2 py-2">
                {edit ? (
                    <input
                        type="number"
                        className="inputFieldTable w-20"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value || 0)}
                    />
                ) : (
                    product.price ?? 0
                )}
            </td>

            <td className="pl-2 py-2 hidden xl:table-cell">
                {edit ? (
                    <input
                        className="inputFieldTable w-full"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                ) : (
                    product.description ?? ""
                )}
            </td>

            <td className="pl-2 py-2 w-[160px] text-center">
                <div className="flex items-center justify-center gap-2">
                    {edit ? (
                        <>
                            <button
                                className="action-icon"
                                onClick={save}
                                disabled={saving}
                            >
                                <Check className="h-4 w-4" />
                            </button>
                            <button
                                className="action-icon"
                                onClick={cancelEdit}
                                disabled={saving}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="action-icon"
                                onClick={() => setEdit(true)}
                                disabled={saving || removing}
                            >
                                <PencilLine className="h-4 w-4" />
                            </button>
                            <button
                                className="action-icon"
                                onClick={remove}
                                disabled={saving || removing}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            {canModerate && (
                                <button
                                    className="action-icon"
                                    onClick={blockProduct}
                                    disabled={saving || removing}
                                >
                                    <Ban className="h-4 w-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </td>

            <td className="pl-2 py-2 w-[64px] text-center">
                <button
                    className="action-icon"
                    onClick={onAddToCart}
                    disabled={edit || saving || removing}
                >
                    <ShoppingCart className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
}
