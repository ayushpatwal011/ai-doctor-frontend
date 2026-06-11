import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Sparkles, Baby, Eye, Brain } from 'lucide-react';

const doctors = [
    { id: 'general physician', name: 'General Physician', Icon: Stethoscope },
    { id: 'cardiologist', name: 'Cardiologist', Icon: Heart },
    { id: 'dermatologist', name: 'Dermatologist', Icon: Sparkles },
    { id: 'pediatrician', name: 'Pediatrician', Icon: Baby },
    { id: 'ophthalmologist', name: 'Ophthalmologist', Icon: Eye },
    { id: 'neurologist', name: 'Neurologist', Icon: Brain },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-header">
                <span className="badge">AI Health Assistant</span>
                <h1 className="home-title">Consult a Specialist</h1>
                <p className="home-subtitle">Get intelligent, instant medical guidance from our specialized AI doctors. Select a specialist below to start your private consultation.</p>
            </div>

            <div className="doctor-grid">
                {doctors.map(doc => (
                    <div key={doc.id} className="doctor-card" onClick={() => navigate(`/chat/${encodeURIComponent(doc.id)}`)}>
                        <div className="icon-wrapper">
                            <doc.Icon size={44} strokeWidth={1.5} />
                        </div>
                        <span className="doctor-name">{doc.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
