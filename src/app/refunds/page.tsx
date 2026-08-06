import PolicyLayout from "@/components/PolicyLayout";

export default function RefundsPolicy() {
  return (
    <PolicyLayout title="Refunds & Returns" lastUpdated="October 15, 2023">
      <h2>1. Our Return Philosophy</h2>
      <p>
        At JPS Fabrics, we take immense pride in the quality of our textiles. Because our fabrics are cut specifically to your requested measurements, we cannot accept returns or exchanges for change of mind.
      </p>

      <h2>2. Defective or Damaged Goods</h2>
      <p>
        If you receive a fabric that is defective or damaged, we will gladly offer a full refund or replacement. You must notify us within 48 hours of receiving your order by emailing support@jpsfabrics.com with photographic evidence of the defect.
      </p>

      <h2>3. The Refund Process</h2>
      <p>
        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
      </p>
      <p>
        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 7-10 business days.
      </p>

      <h2>4. Non-Returnable Items</h2>
      <ul>
        <li>Fabrics that have been cut, washed, or altered in any way after delivery.</li>
        <li>Custom dyed fabrics.</li>
        <li>Clearance or sale items.</li>
      </ul>
    </PolicyLayout>
  );
}
