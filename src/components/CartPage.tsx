import { useDispatch, useSelector } from "react-redux";
import {
    selectCart,
    selectCartTotal,
    changeQty,
    removeFromCart,
    clearCart,
} from "../store/cartSlice";
import { thunkCreateOrder } from "../store/ordersSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const items = useSelector(selectCart);
    const total = useSelector(selectCartTotal);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onCreateOrder = async () => {
        if (!items.length) return;
        const productQuantities = Object.fromEntries(
            items.map((i) => [i.id, i.qty])
        );
        try {
            await (dispatch as any)(
                thunkCreateOrder({ productQuantities })
            ).unwrap();
            dispatch(clearCart());
            navigate("/orders");
        } catch (e) {
            console.error(e);
            alert("Order create failed");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl mb-3">Cart</h1>

            {!items.length ? (
                <div>Cart is empty</div>
            ) : (
                <table className="w-full border">
                    <thead>
                    <tr>
                        <th className="text-left p-2">Product</th>
                        <th className="text-left p-2">Supplier</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Qty</th>
                        <th className="text-left p-2">Sum</th>
                        <th className="text-left p-2" />
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((i) => (
                        <tr key={i.id} className="border-t">
                            <td className="p-2">{i.name}</td>
                            <td className="p-2">{i.supplierLogin}</td>
                            <td className="p-2">{i.price}</td>
                            <td className="p-2">
                                <input
                                    className="inputFieldTable w-20 px-2"
                                    type="number"
                                    min={1}
                                    value={i.qty}
                                    onChange={(e) =>
                                        dispatch(
                                            changeQty({ id: i.id, qty: Number(e.target.value) })
                                        )
                                    }
                                />
                            </td>
                            <td className="p-2">{i.price * i.qty}</td>
                            <td className="p-2">
                                <button
                                    className="action-btn"
                                    onClick={() => dispatch(removeFromCart(i.id))}
                                    title="Remove"
                                >
                                    ✖
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr className="border-t">
                        <td className="p-2 font-medium" colSpan={4}>
                            Total
                        </td>
                        <td className="p-2 font-medium">{total}</td>
                        <td />
                    </tr>
                    </tbody>
                </table>
            )}

            <div className="mt-4 flex gap-2">
                <button className="button px-4 py-2 rounded" onClick={onCreateOrder} disabled={!items.length}>
                    Create order
                </button>
                <button
                    className="action-btn px-4 py-2 rounded"
                    onClick={() => dispatch(clearCart())}
                    disabled={!items.length}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
