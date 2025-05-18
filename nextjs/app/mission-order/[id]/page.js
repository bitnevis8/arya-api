'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function MissionOrderDetail() {
    const params = useParams();
    const [missionOrder, setMissionOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const fetchMissionOrder = async () => {
            try {
                const response = await fetch(`/api/mission-order/${params.id}`);
                const data = await response.json();
                if (data.success) {
                    setMissionOrder(data.data);
                    // تنظیم URL برای QR Code
                    setQrCodeUrl(`${window.location.origin}/mission-order/${data.data.id}`);
                }
            } catch (error) {
                console.error('Error fetching mission order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMissionOrder();
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">در حال بارگذاری...</div>;
    }

    if (!missionOrder) {
        return <div className="flex justify-center items-center min-h-screen">ماموریت یافت نشد</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-bold">جزئیات ماموریت</h1>
                    {qrCodeUrl && (
                        <div className="bg-white p-4 rounded-lg shadow">
                            <QRCodeSVG 
                                value={qrCodeUrl}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                            <p className="text-center mt-2 text-sm text-gray-600">اسکن کنید تا به جزئیات ماموریت دسترسی پیدا کنید</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">اطلاعات شخصی</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">نام:</span> {missionOrder.firstName}</p>
                            <p><span className="font-medium">نام خانوادگی:</span> {missionOrder.lastName}</p>
                            <p><span className="font-medium">شماره پرسنلی:</span> {missionOrder.personnelNumber}</p>
                            <p><span className="font-medium">واحد:</span> {missionOrder.fromUnit}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">اطلاعات ماموریت</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">تاریخ:</span> {missionOrder.day}</p>
                            <p><span className="font-medium">ساعت:</span> {missionOrder.time}</p>
                            <p><span className="font-medium">موضوع:</span> {missionOrder.missionSubject}</p>
                            <p><span className="font-medium">توضیحات:</span> {missionOrder.missionDescription}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">مقصدها</h2>
                        <div className="space-y-2">
                            {missionOrder.destinations && missionOrder.destinations.map((dest, index) => (
                                <div key={index} className="border-b pb-2">
                                    <p><span className="font-medium">مقصد {index + 1}:</span> {dest.address}</p>
                                    <p><span className="font-medium">مسافت:</span> {dest.distance} کیلومتر</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">اطلاعات تکمیلی</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">همراهان:</span> {missionOrder.companions}</p>
                            <p><span className="font-medium">وسیله نقلیه:</span> {missionOrder.transport}</p>
                            <p><span className="font-medium">وزن کل:</span> {missionOrder.totalWeightKg} کیلوگرم</p>
                            <p><span className="font-medium">مسافت کل:</span> {missionOrder.distance} کیلومتر</p>
                            <p><span className="font-medium">مسافت رفت و برگشت:</span> {missionOrder.roundTripDistance} کیلومتر</p>
                            <p><span className="font-medium">زمان تخمینی:</span> {missionOrder.estimatedTime}</p>
                            <p><span className="font-medium">زمان تخمینی بازگشت:</span> {missionOrder.estimatedReturnTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 