import { useState } from 'react';

interface InsuranceInput {
    propertyValue: number;
    state: string;
    unitType: 'apartment' | 'condo' | 'house' | 'townhouse';
    coverageLevel: 'basic' | 'standard' | 'premium';
    deductible: 250 | 500 | 1000 | 2500;
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const BASE_RATE = 180;
const VALUE_RATE_PER_10K = 12;
const STATE_MULT: Record<string, number> = { LA: 1.45, FL: 1.40, TX: 1.35, OK: 1.30, MS: 1.25, AL: 1.20, CA: 1.15, NY: 1.15, DEFAULT: 1.00 };
const UNIT_TYPE_MULT = { apartment: 1.00, condo: 0.95, house: 1.15, townhouse: 1.05 };
const COVERAGE_MULT = { basic: 0.70, standard: 1.00, premium: 1.40 };
const DEDUCTIBLE_MULT: Record<number, number> = { 250: 1.15, 500: 1.00, 1000: 0.90, 2500: 0.75 };

const COVERAGE_SUMMARY: Record<string, string[]> = {
    basic: ['Personal property coverage', 'Basic liability protection', 'Fire and theft coverage', 'Lowest premium'],
    standard: ['Enhanced property limits', 'Full liability coverage', 'Additional living expenses', 'Water damage protection'],
    premium: ['Replacement cost coverage', 'Extended liability limits', 'Valuable items coverage', 'Identity theft protection']
};

const COVERAGE_DETAILS: Record<string, { label: string; included: boolean }[]> = {
    basic: [{ label: 'Personal Property', included: true }, { label: 'Liability Protection', included: true }, { label: 'Additional Living Expenses', included: false }, { label: 'Medical Payments', included: false }, { label: 'Valuable Items Coverage', included: false }, { label: 'Identity Theft Protection', included: false }],
    standard: [{ label: 'Personal Property', included: true }, { label: 'Liability Protection', included: true }, { label: 'Additional Living Expenses', included: true }, { label: 'Medical Payments', included: true }, { label: 'Valuable Items Coverage', included: false }, { label: 'Identity Theft Protection', included: false }],
    premium: [{ label: 'Personal Property', included: true }, { label: 'Liability Protection', included: true }, { label: 'Additional Living Expenses', included: true }, { label: 'Medical Payments', included: true }, { label: 'Valuable Items Coverage', included: true }, { label: 'Identity Theft Protection', included: true }]
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

function App() {
    const [values, setValues] = useState<InsuranceInput>({ propertyValue: 25000, state: 'CA', unitType: 'apartment', coverageLevel: 'standard', deductible: 500 });
    const handleChange = (field: keyof InsuranceInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const annual = Math.round((BASE_RATE + (values.propertyValue / 10000) * VALUE_RATE_PER_10K) * (STATE_MULT[values.state] || STATE_MULT.DEFAULT) * UNIT_TYPE_MULT[values.unitType] * COVERAGE_MULT[values.coverageLevel] * DEDUCTIBLE_MULT[values.deductible]);
    const monthly = Math.round(annual / 12);
    const details = COVERAGE_DETAILS[values.coverageLevel];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Renters Insurance Cost Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Get an instant estimate of your renters insurance premium</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="propertyValue">Personal Property Value ($)</label>
                            <input id="propertyValue" type="number" min="5000" max="200000" step="1000" value={values.propertyValue || ''} onChange={(e) => handleChange('propertyValue', parseInt(e.target.value) || 0)} placeholder="25000" />
                        </div>
                        <div>
                            <label htmlFor="state">State</label>
                            <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="unitType">Unit Type</label>
                            <select id="unitType" value={values.unitType} onChange={(e) => handleChange('unitType', e.target.value)}>
                                <option value="apartment">Apartment</option>
                                <option value="condo">Condo</option>
                                <option value="house">Rented House</option>
                                <option value="townhouse">Townhouse</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deductible">Deductible</label>
                            <select id="deductible" value={values.deductible} onChange={(e) => handleChange('deductible', parseInt(e.target.value))}>
                                <option value="250">$250</option>
                                <option value="500">$500</option>
                                <option value="1000">$1,000</option>
                                <option value="2500">$2,500</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="coverageLevel">Coverage Level</label>
                        <select id="coverageLevel" value={values.coverageLevel} onChange={(e) => handleChange('coverageLevel', e.target.value)}>
                            <option value="basic">Basic (Essential Coverage)</option>
                            <option value="standard">Standard (Recommended)</option>
                            <option value="premium">Premium (Maximum Protection)</option>
                        </select>
                    </div>
                    <button className="btn-primary" type="button">Get Estimate</button>
                </div>
            </div>

            <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Estimated Monthly Cost</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{fmt(monthly)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per month</div>
                </div>
                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL COST</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(annual)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PROPERTY VALUE</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>${fmtNum(values.propertyValue)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Summary</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {COVERAGE_SUMMARY[values.coverageLevel].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Coverage Details</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {details.map((d, i) => (
                            <tr key={i} style={{ borderBottom: i === details.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: i % 2 ? '#F8FAFC' : 'transparent' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{d.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: d.included ? '#10B981' : '#94A3B8' }}>{d.included ? 'Included' : 'Not Included'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides an informational estimate of renters insurance costs based on common rating factors such as personal property value, location, unit type, coverage level, and deductible. The figures shown are estimates only. Actual insurance premiums vary based on building age, claims history, credit score, and insurer criteria. Contact licensed providers for accurate quotes.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Actual premiums vary</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Renters Insurance Cost Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
