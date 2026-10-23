export const initialData = {
  offices: [
    { id: 1, name: 'مكتب الريان للسفر', city: 'صنعاء', role: 'مكتب مركزي', status: 'approved' },
    { id: 2, name: 'مكتب العدالة', city: 'عدن', role: 'مكتب فرعي', status: 'approved' },
    { id: 3, name: 'مكتب القمة', city: 'تعز', role: 'مكتب فرعي', status: 'pending' },
    { id: 4, name: 'مكتب الأمان', city: 'المكلا', role: 'مكتب مركزي', status: 'approved' },
  ],
  clients: [
    { id: 1, name: 'أحمد علي', phone: '966500000001', officeId: 1, status: 'active' },
    { id: 2, name: 'سارة محمد', phone: '966500000002', officeId: 2, status: 'active' },
    { id: 3, name: 'خالد سالم', phone: '966500000003', officeId: 1, status: 'pending' },
    { id: 4, name: 'مها عبدالله', phone: '966500000004', officeId: 4, status: 'active' },
  ],
  trips: [
    { id: 1, title: 'رحلة صنعاء → جدة', from: 'صنعاء', to: 'جدة', officeId: 1, status: 'active' },
    { id: 2, title: 'رحلة عدن → الرياض', from: 'عدن', to: 'الرياض', officeId: 2, status: 'scheduled' },
    { id: 3, title: 'رحلة تعز → أبو ظبي', from: 'تعز', to: 'أبو ظبي', officeId: 3, status: 'active' },
    { id: 4, title: 'رحلة المكلا → القاهرة', from: 'المكلا', to: 'القاهرة', officeId: 4, status: 'completed' },
  ],
  bookings: [
    { id: 1, clientId: 1, tripId: 1, amount: 1500, status: 'pending' },
    { id: 2, clientId: 2, tripId: 2, amount: 2200, status: 'confirmed' },
    { id: 3, clientId: 3, tripId: 3, amount: 1800, status: 'pending' },
    { id: 4, clientId: 4, tripId: 4, amount: 2600, status: 'completed' },
  ],
  logs: [
    { id: 1, message: 'تم تحديث حالة المكتب رقم 1', createdAt: new Date().toISOString() },
    { id: 2, message: 'تم تأكيد حجز العميل سارة محمد', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, message: 'تم إضافة رحلة جديدة في جدول التشغيل', createdAt: new Date(Date.now() - 7200000).toISOString() },
  ],
};
