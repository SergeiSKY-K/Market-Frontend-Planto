import { Ban } from "lucide-react";
import { toggleProductStatus } from "../../../features/api/productAction";
import type { Product } from "../../../utils/types/product.ts";
type RowProps = {
    product: Product;
    onSavedLocal?: (p: Product) => void;
    onDeletedLocal?: () => void;
    onAddToCart?: () => void;
    onBlockedLocal?: () => void;
    showStatus?: boolean;
};

export default function RowProductsTable({
                                             product,
                                             onBlockedLocal,
                                             onAddToCart,
                                         }: RowProps) {
    const blockProduct = async () => {
        try {
            await toggleProductStatus(product.id, true);
            onBlockedLocal?.();
        } catch (e: unknown) {
            const err = e as Error;
            console.error(err);
            alert(`Block failed: ${err.message}`);
        }
    };

    return (
        <tr className="align-top">
            {/* ...другие td */}

            <td className="pl-2 py-2 w-[120px]">
                <div className="flex items-center gap-2">
                    <button
                        className="action-icon"
                        title="Block"
                        onClick={blockProduct}
                    >
                        <Ban className="h-4 w-4" />
                    </button>
                </div>
            </td>

            <td className="pl-2 py-2 w-[54px]">
                <button
                    className="action-icon"
                    title="Add to cart"
                    onClick={onAddToCart}
                >
                    🛒
                </button>
            </td>
        </tr>
    );
}

