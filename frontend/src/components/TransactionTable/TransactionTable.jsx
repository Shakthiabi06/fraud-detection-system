export default function TransactionTable({ transactions }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Country</th>
          <th>Merchant</th>
          <th>Fraud Score</th>
          <th>Prediction</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.transaction_id}>
            <td>{transaction.transaction_id}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.country}</td>
            <td>{transaction.merchant}</td>
            <td>{transaction.fraud_score}</td>
            <td>{transaction.prediction}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}