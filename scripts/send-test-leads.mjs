// Sends 12 synthetic leads to your n8n webhook and prints how each was scored.
// Usage: node send-test-leads.mjs [webhook-url]

const leads = [
  { first_name: 'Anna', last_name: 'Keller', email: 'anna.keller@nordsee-versicherung.example', job_title: 'Head of Data Science', company: 'Nordsee Versicherung', company_size: '5000+', industry: 'Insurance', use_case: 'We want to predict claims fraud on about 3M rows of tabular policy data. Currently using XGBoost and want to benchmark.', timeline: 'Within 3 months' },
  { first_name: 'Marcus', last_name: 'Lindqvist', email: 'm.lindqvist@baltic-capital.example', job_title: 'Director, Credit Risk Analytics', company: 'Baltic Capital Bank', company_size: '1001-5000', industry: 'Financial Services', use_case: 'Credit default prediction on structured customer data, comparing against our gradient boosting models.', timeline: 'Within 3 months' },
  { first_name: 'Priya', last_name: 'Raman', email: 'priya.raman@medipharm.example', job_title: 'Principal Data Scientist', company: 'MediPharm Group', company_size: '5000+', industry: 'Healthcare & Pharma', use_case: 'Forecasting patient trial dropout from tabular clinical data.', timeline: '3-6 months' },
  { first_name: 'Jonas', last_name: 'Becker', email: 'jonas.becker@stahlwerk-ost.example', job_title: 'Maintenance Analytics Lead', company: 'Stahlwerk Ost', company_size: '1001-5000', industry: 'Manufacturing', use_case: 'Predictive maintenance using sensor data exported to CSV tables.', timeline: '3-6 months' },
  { first_name: 'Sofia', last_name: 'Martins', email: 'sofia@modahaus.example', job_title: 'Data Analyst', company: 'ModaHaus', company_size: '201-1000', industry: 'Retail & E-commerce', use_case: 'Demand forecasting for our product catalogue.', timeline: 'Exploring' },
  { first_name: 'Tom', last_name: 'Weber', email: 'tom@pixelforge.example', job_title: 'CTO', company: 'PixelForge', company_size: '1-50', industry: 'Software', use_case: 'Thinking about adding ML predictions to our SaaS product for customer churn.', timeline: '3-6 months' },
  { first_name: 'Lena', last_name: 'Hoffmann', email: 'lena.hoffmann@stadtwerke-sued.example', job_title: 'Business Intelligence Manager', company: 'Stadtwerke Süd', company_size: '1001-5000', industry: 'Energy & Utilities', use_case: 'Not sure yet, saw your paper.', timeline: 'Exploring' },
  { first_name: 'Kai', last_name: 'Nguyen', email: 'kai.nguyen94@gmail.com', job_title: 'Student', company: 'TU Berlin', company_size: '1-50', industry: 'Education', use_case: 'Curious about AI for my thesis', timeline: 'Exploring' },
  { first_name: 'Ravi', last_name: 'Shah', email: 'ravi.shah@gmail.com', job_title: 'Machine Learning Engineer', company: '', company_size: 'unknown', industry: 'unknown', use_case: 'Want to try TabPFN on a Kaggle classification dataset with tabular features.', timeline: 'Exploring' },
  { first_name: 'Elena', last_name: 'Popescu', email: 'elena.popescu@telcoeuropa.example', job_title: 'VP Customer Analytics', company: 'TelcoEuropa', company_size: '5000+', industry: 'Telecommunications', use_case: 'Churn prediction across 20M subscribers, replacing an AutoML setup.', timeline: 'Within 3 months' },
  { first_name: 'Max', last_name: 'Fischer', email: 'max.fischer@', job_title: 'Engineer', company: 'Unknown GmbH', company_size: '51-200', industry: 'Manufacturing', use_case: 'Testing the form', timeline: 'Exploring' },
  { first_name: 'Hannah', last_name: 'Schulz', email: 'h.schulz@logistik-nord.example', job_title: 'Operations Manager', company: 'Logistik Nord', company_size: '201-1000', industry: 'Logistics', use_case: 'We have spreadsheets of delivery times and want to estimate delays.', timeline: '3-6 months' },
].map((l) => ({ ...l, source: 'website_form' }));

const url = process.argv[2] || 'http://localhost:5678/webhook/inbound-lead';
console.log(`Sending ${leads.length} test leads to ${url}\n`);

for (const lead of leads) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.log(`✗ ${lead.email} → HTTP ${res.status}. Is the workflow active?`);
      continue;
    }
    const r = await res.json();
    console.log(`${r.tier.toUpperCase().padEnd(8)} ${String(r.score).padStart(3)}  ${lead.first_name} ${lead.last_name}, ${lead.company || '(no company)'}`);
  } catch (err) {
    console.log(`✗ Could not reach n8n (${err.message}). Is it running?`);
    break;
  }
}
