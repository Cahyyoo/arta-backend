const supabase = require("../config/supabase");

exports.getReport = async (req, res) => {
  const { business_id } = req.params;
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date)
    return res.status(400).json({ error: "start_date & end_date diperlukan" });

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("category, type, amount, date")
      .eq("business_id", business_id)
      .gte("date", start_date)
      .lte("date", end_date);

    if (error) throw error;

    const categorySummary = data.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});

    res.status(200).json({
      period: { start_date, end_date },
      summary_by_category: categorySummary,
      data_raw: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
