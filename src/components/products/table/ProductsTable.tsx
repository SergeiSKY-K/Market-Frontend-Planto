// добавьте импорт и тип
import { Ban } from "lucide-react";
import { toggleProductStatus } from "../../../features/api/productAction";

type RowProps = {
    product: any;
    onSavedLocal?: (p: any) => void;
    onDeletedLocal?: () => void;
    onAddToCart?: () => void;
    onBlockedLocal?: () => void;    // <— NEW
    showStatus?: boolean;
};

export default function Row({ product, onBlockedLocal, /*...*/ }: RowProps) {
    // ...
    const blockProduct = async () => {
        try {
            await toggleProductStatus(String(product.id), true);
            onBlockedLocal?.(); // <— мгновенно убираем строку
        } catch (e: any) {
            console.error(e);
            alert(`Block failed: ${e?.message ?? e}`);
        }
    };

    return (
        <tr className="align-top">
            {/* ...другие ячейки... */}

            {/* Actions */}
            <td className="pl-2 py-2 w-[120px]">
                <div className="flex items-center gap-2">
                    {/* ваши edit/delete */}
                    <button className="action-icon" title="Block" onClick={blockProduct}>
                        <Ban className="h-4 w-4" />
                    </button>
                </div>
            </td>

            {/* Cart */}
            <td className="pl-2 py-2 w-[54px]">
                {/* кнопка корзины */}
            </td>
        </tr>
    );
}
