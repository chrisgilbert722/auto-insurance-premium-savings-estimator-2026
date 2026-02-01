import { useState } from 'react';

interface SavingsInput {
    ageRange: '16-19' | '20-24' | '25-29' | '30-64' | '65-74' | '75+';
    state: string;
    vehicleType: 'sedan' | 'suv' | 'truck' | 'sports' | 'luxury' | 'electric';
    coverageLevel: 'minimum' | 'standard' | 'full';
    drivingHistory: 'clean' | 'minor';
    currentPremium: number;
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const AGE_FACTOR: Record<string, number> = { '16-19': 1.85, '20-24': 1.55, '25-29': 1.20, '30-64': 1.00, '65-74': 1.15, '75+': 1.35 };
const STATE_FACTOR: Record<string, number> = { MI: 1.45, LA: 1.40, FL: 1.35, NY: 1.30, CA: 1.25, NJ: 1.28, TX: 1.20, DEFAULT: 1.00 };
const VEHICLE_FACTOR: Record<string, number> = { sedan: 1.00, suv: 1.10, truck: 1.08, sports: 1.45, luxury: 1.55, electric: 1.15 };
const COVERAGE_FACTOR: Record<string, number> = { minimum: 0.65, standard: 1.00, full: 1.45 };
const HISTORY_FACTOR: Record<string, number> = { clean: 0.85, minor: 1.00 };

const SAVINGS_TIPS: Record<string, string[]> = {
    minimum: ['Lower premium with basic coverage', 'State-required liability only', 'Best for older vehicles', 'Higher out-of-pocket risk'],
    standard: ['Balanced protection and cost', 'Collision coverage included', 'Uninsured motorist protection', 'Good for most drivers'],
    full: ['Maximum coverage protection', 'Comprehensive + collision', 'Lower deductibles available', 'Best for newer vehicles']
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<SavingsInput>({ ageRange: '30-64', state: 'CA', vehicleType: 'sedan', coverageLevel: 'standard', drivingHistory: 'clean', currentPremium: 180 });
    const handleChange = (field: keyof SavingsInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const ageFactor = AGE_FACTOR[values.ageRange];
    const stateFactor = STATE_FACTOR[values.state] || STATE_FACTOR.DEFAULT;
    const vehicleFactor = VEHICLE_FACTOR[values.vehicleType];
    const coverageFactor = COVERAGE_FACTOR[values.coverageLevel];
    const historyFactor = HISTORY_FACTOR[values.drivingHistory];

    const riskAdjustment = ageFactor * stateFactor * vehicleFactor * historyFactor;
    const baselineMultiplier = riskAdjustment * coverageFactor;
    const savingsMultiplier = Math.max(0.70, Math.min(1.0, 1.0 / baselineMultiplier * 0.92));

    const estimatedNewPremium = Math.round(values.currentPremium * savingsMultiplier);
    const monthlySavings = Math.max(0, values.currentPremium - estimatedNewPremium);
    const annualSavings = monthlySavings * 12;

    const breakdownData = [
        { label: 'Current Premium', value: fmt(values.currentPremium), isDeduction: false },
        { label: 'Risk Adjustment Factor', value: riskAdjustment.toFixed(2) + 'x', isDeduction: false },
        { label: 'Coverage Adjustment', value: coverageFactor.toFixed(2) + 'x', isDeduction: false },
        { label: 'Estimated New Premium', value: fmt(estimatedNewPremium), isDeduction: false, isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Auto Insurance Premium Savings Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate your potential auto insurance savings</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="ageRange">Driver Age Range</label>
                            <select id="ageRange" value={values.ageRange} onChange={(e) => handleChange('ageRange', e.target.value)}>
                                <option value="16-19">16-19 years</option>
                                <option value="20-24">20-24 years</option>
                                <option value="25-29">25-29 years</option>
                                <option value="30-64">30-64 years</option>
                                <option value="65-74">65-74 years</option>
                                <option value="75+">75+ years</option>
                            </select>
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
                            <label htmlFor="vehicleType">Vehicle Type</label>
                            <select id="vehicleType" value={values.vehicleType} onChange={(e) => handleChange('vehicleType', e.target.value)}>
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="truck">Truck</option>
                                <option value="sports">Sports Car</option>
                                <option value="luxury">Luxury Vehicle</option>
                                <option value="electric">Electric Vehicle</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="drivingHistory">Driving History</label>
                            <select id="drivingHistory" value={values.drivingHistory} onChange={(e) => handleChange('drivingHistory', e.target.value)}>
                                <option value="clean">Clean Record</option>
                                <option value="minor">Minor Issues</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="coverageLevel">Coverage Level</label>
                            <select id="coverageLevel" value={values.coverageLevel} onChange={(e) => handleChange('coverageLevel', e.target.value)}>
                                <option value="minimum">Minimum (Liability Only)</option>
                                <option value="standard">Standard (Liability + Collision)</option>
                                <option value="full">Full (Comprehensive)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="currentPremium">Current Monthly Premium ($)</label>
                            <input id="currentPremium" type="number" min="50" max="1000" step="10" value={values.currentPremium || ''} onChange={(e) => handleChange('currentPremium', parseInt(e.target.value) || 0)} placeholder="180" />
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Calculate Savings</button>
                </div>
            </div>

            <div className="card" style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Estimated Monthly Savings</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#16A34A', lineHeight: 1 }}>{fmt(monthlySavings)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per month</div>
                </div>
                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #86EFAC' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL SAVINGS</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#16A34A' }}>{fmt(annualSavings)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #86EFAC', paddingLeft: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>NEW PREMIUM</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(estimatedNewPremium)}/mo</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Tips</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {SAVINGS_TIPS[values.coverageLevel].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Premium Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0FDF4' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? '#16A34A' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides informational estimates of potential auto insurance savings based on driver profile and coverage preferences. The figures shown are estimates only and do not constitute an insurance quote. Actual premiums and savings vary based on driving record, credit history, vehicle details, and insurer criteria. Contact licensed insurance providers for accurate quotes and policy information.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not an insurance quote</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Auto Insurance Premium Savings Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
