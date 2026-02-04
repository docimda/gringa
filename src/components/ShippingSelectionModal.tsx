import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ShippingRate } from "@/types/product";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface ShippingSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectRate: (rate: ShippingRate) => void;
    currentRate: ShippingRate | null;
}

export function ShippingSelectionModal({
    open,
    onOpenChange,
    onSelectRate,
    currentRate,
}: ShippingSelectionModalProps) {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [selectedRateId, setSelectedRateId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchRates();
            if (currentRate) {
                setSelectedRateId(currentRate.id);
            }
        }
    }, [open, currentRate]);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("shipping_rates")
                .select("*")
                .order("neighborhood");

            if (error) throw error;
            setRates(data || []);
        } catch (error) {
            console.error("Error fetching rates:", error);
            toast.error("Erro ao carregar taxas de entrega");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        const rate = rates.find((r) => r.id === selectedRateId);
        if (rate) {
            onSelectRate(rate);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Selecione seu Bairro
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bairro de Entrega (Extrema/MG)</label>
                        <Select value={selectedRateId} onValueChange={setSelectedRateId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {rates.map((rate) => (
                                    <SelectItem key={rate.id} value={rate.id}>
                                        {rate.neighborhood} - R$ {rate.price.toFixed(2)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="w-full gradient-gold text-primary-foreground"
                        onClick={handleConfirm}
                        disabled={!selectedRateId}
                    >
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
