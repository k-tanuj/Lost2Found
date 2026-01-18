
import { CheckCircle, Shield, AlertCircle, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'returned':
                return {
                    icon: CheckCircle,
                    text: 'Returned',
                    className: 'bg-emerald-100 text-emerald-700 border-emerald-200'
                };
            case 'secured':
                return {
                    icon: Shield,
                    text: 'Secured at Office',
                    className: 'bg-blue-100 text-blue-700 border-blue-200'
                };
            case 'claimed':
                return {
                    icon: AlertCircle,
                    text: 'Claim Pending',
                    className: 'bg-amber-100 text-amber-700 border-amber-200'
                };
            default:
                return {
                    icon: Clock,
                    text: 'Active',
                    className: 'bg-slate-100 text-slate-600 border-slate-200'
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide w-fit ${config.className}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.text}
        </div>
    );
}
