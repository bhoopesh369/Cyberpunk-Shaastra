import { useState } from "react";

const Calculator = () => {
    const [value, setValue] = useState<number>(0);

    const handleAdd = () => {
        setValue(value + 1);
    };

    const handleSubtract = () => {
        setValue(value - 1);
    };

    return (
        <div className="p-4">
            <h1>Calculator</h1>
            <h2>{value}</h2>
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleSubtract}>Subtract</button>
        </div>
    );
};

export default Calculator;


