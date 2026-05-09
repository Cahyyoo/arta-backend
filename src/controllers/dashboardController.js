const supabase = require("../config/supabase");

exports.getDashboardStats = async (req, res) => {
  const { business_id } = req.params;
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("type, amount")
      .eq("business_id", business_id);

    if (error) throw error;

    let totalIncome = 0,
      totalExpense = 0;
    transactions.forEach((trx) => {
      if (trx.type === "income") totalIncome += Number(trx.amount);
      if (trx.type === "expense") totalExpense += Number(trx.amount);
    });

    res.status(200).json({
      business_id,
      total_income: totalIncome,
      total_expense: totalExpense,
      current_balance: totalIncome - totalExpense,
      total_transactions: transactions.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
