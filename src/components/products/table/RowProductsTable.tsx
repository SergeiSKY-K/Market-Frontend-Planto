import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { getRolesFromJwt } from "../../../utils/jwt";

import { PencilLine, Trash2, ShoppingCart, Check, X, ImagePlus, Ban } from "lucide-react";
import { updateProduct, deleteProduct, toggleProductStatus } from "../../../features/api/productAction";
import { uploadProductImage } from "../../../features/api/imageAction";

type AnyProduct = {
    id: string | number;
    name: string;
    price: number;
    quantity?: number;
    description?: string;
    category?: { name?: string } | string;
    imageUrl?: string; image?: string; photoUrl?: string;
    supplierLogin?: string; supplier?: { login?: string };
};

type Props = {
    product: AnyProduct;
    onSavedLocal?: (p: AnyProduct) => void;
    onDeletedLocal?: () => void;
    onAddToCart?: () => void;
    onBlockedLocal?: () => void;  // ← для мгновенного удаления строки после block
    showStatus?: boolean;
};

export default function RowProductsTable({
                                             product,
                                             onSavedLocal,
                                             onDeletedLocal,
                                             onAddToCart,
                                             onBlockedLocal,
                                         }: Props) {
    // роли → модератор/админ могут блокировать
    const token   = useSelector((s: RootState) => s.token.accessToken);
    const roles   = token ? getRolesFromJwt(token) : [];
    const canModerate = roles.includes("MODERATOR") || roles.includes("ADMINISTRATOR");

    const initialImg = product.imageUrl ?? product.image ?? product.photoUrl ?? "";
    const categoryText = useMemo(
        () => (typeof product.category === "string" ? product.category : (product.category?.name ?? "")),
        [product.category]
    );

    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);

    const [name, setName]   = useState(product.name);
    const [price, setPrice] = useState<number>(Number(product.price) || 0);
    const [qty, setQty]     = useState<number>(Number(product.quantity ?? 0));
    const [desc, setDesc]   = useState(product.description ?? "");
    const [imgPreview, setImgPreview] = useState<string>(initialImg);
    const [file, setFile] = useState<File | null>(null);

    const enterEdit = () => setEdit(true);
    const cancelEdit = () => {
        setEdit(false);
        setName(product.name);
        setPrice(Number(product.price) || 0);
        setQty(Number(product.quantity ?? 0));
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
            // 0) если есть новый файл — загрузим, получим url
            let finalImageUrl = initialImg;
            if (file) {
                const url = await uploadProductImage(file, product.id);
                if (url) finalImageUrl = url;
            }

            // 1) PUT
            const payload: AnyProduct = {
                ...product,
                name: name.trim(),
                price,
                quantity: qty,
                description: desc?.trim() ?? "",
                imageUrl: finalImageUrl,
            };
            await updateProduct(payload);

            // 2) локально заменить строку
            onSavedLocal?.(payload);
            setEdit(false);
            setFile(null);
        } catch (e: any) {
            console.error(e);
            alert(`Save failed: ${e?.message ?? e}`);
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
        } catch (e: any) {
            console.error(e);
            alert(`Delete failed: ${e?.message ?? e}`);
        } finally {
            setRemoving(false);
        }
    };

    const blockProduct = async () => {
        try {
            await toggleProductStatus(String(product.id), true);
            onBlockedLocal?.(); // мгновенно убираем строку из таблицы
        } catch (e: any) {
            console.error(e);
            alert(`Block failed: ${e?.message ?? e}`);
        }
    };

    return (
        <tr className="align-top">
            {/* Image */}
            <td className="pl-2 py-2">
                <div className="flex items-center gap-2">
                    {imgPreview
                        ? <img src={imgPreview} alt={name} className="h-14 w-14 rounded-full object-cover" />
                        : <div className="h-14 w-14 rounded-full bg-[var(--color-light-green)]/30" />}
                    {edit && (
                        <label className="action-icon" title="Upload image">
                            <ImagePlus className="h-4 w-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                        </label>
                    )}
                </div>
            </td>

            {/* Name */}
            <td className="pl-2 py-2">
                {edit
                    ? <input className="inputFieldTable w-full" value={name} onChange={(e) => setName(e.target.value)} />
                    : product.name}
            </td>

            {/* Category */}
            <td className="pl-2 py-2">{categoryText}</td>

            {/* Quantity */}
            <td className="pl-2 py-2">
                {edit
                    ? <input type="number" className="inputFieldTable w-24" value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} />
                    : (product.quantity ?? 0)}
            </td>

            {/* Price */}
            <td className="pl-2 py-2">
                {edit
                    ? <input type="number" className="inputFieldTable w-24" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
                    : (Number(product.price) || 0)}
            </td>

            {/* Description (скрываем на узких экранах) */}
            <td className="pl-2 py-2 hidden xl:table-cell">
                {edit
                    ? <input className="inputFieldTable w-full" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    : (product.description ?? "")}
            </td>

            {/* Actions — фикс ширина и центр */}
            <td className="pl-2 py-2 w-[150px] text-center">
                <div className="flex items-center justify-center gap-2">
                    {edit ? (
                        <>
                            <button className="action-icon" title="Save" onClick={save} disabled={saving}>
                                <Check className="h-4 w-4" />
                            </button>
                            <button className="action-icon" title="Cancel" onClick={cancelEdit} disabled={saving}>
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="action-icon" title="Edit" onClick={enterEdit} disabled={saving || removing}>
                                <PencilLine className="h-4 w-4" />
                            </button>
                            <button className="action-icon" title="Delete" onClick={remove} disabled={saving || removing}>
                                <Trash2 className="h-4 w-4" />
                            </button>
                            {canModerate && (
                                <button className="action-icon" title="Block" onClick={blockProduct} disabled={saving || removing}>
                                    <Ban className="h-4 w-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </td>

            {/* Cart — фикс ширина и центр */}
            <td className="pl-2 py-2 w-[64px] text-center">
                <button
                    className="action-icon"
                    title="Add to cart"
                    onClick={onAddToCart}
                    disabled={edit || saving || removing}
                >
                    <ShoppingCart className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
}
