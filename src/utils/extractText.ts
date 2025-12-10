export const extractAmounts = (text: string) => {
    const subtotalMatch = /subtotal:\s*\$?([\d.,]+)/i.exec(text);
    const amountDueMatch = /Amount Due:\s*\$?([\d.,]+)/i.exec(text);
    const balanceFromPreviousBill = /Balance from previous bill\s*\$?([\d.,]+)/i.exec(text);
    const totalElectricityCharge = /total electricity charges\s*\$?([\d.,]+)/i.exec(text);

    return {
        subtotal: subtotalMatch ? subtotalMatch[1] : null,
        amountDue: amountDueMatch ? amountDueMatch[1] : null,
        balanceFromPreviousBill: balanceFromPreviousBill ? balanceFromPreviousBill[1] : null,
        totalElectricityCharge: totalElectricityCharge ? totalElectricityCharge[1] : null,
    };
};
