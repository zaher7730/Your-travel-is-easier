import { createStore, safeLoadState } from './data/store.js';
import { initialData } from './data/mockData.js';

const navigation = [
  { id: 'dashboard', label: 'لوحة التحكم' },
  { id: 'offices', label: 'المكاتب' },
  { id: 'clients', label: 'العملاء' },
  { id: 'trips', label: 'الرحلات' },
  { id: 'bookings', label: 'الحجوزات' },
  { id: 'logs', label: 'سجل العمليات' },
];

export function createApp(root) {
  const store = createStore(safeLoadState(initialData));
  let currentView = 'dashboard';

  function render() {
    const state = store.getState();
    const metrics = {
      offices: state.offices.length,
      clients: state.clients.length,
      trips: state.trips.length,
      bookings: state.bookings.length,
      approvedOffices: state.offices.filter((office) => office.status === 'approved').length,
      activeTrips: state.trips.filter((trip) => trip.status === 'active').length,
      pendingBookings: state.bookings.filter((booking) => booking.status === 'pending').length,
    };

    const content = {
      dashboard: renderDashboard(state, metrics),
      offices: renderOffices(state),
      clients: renderClients(state),
      trips: renderTrips(state),
      bookings: renderBookings(state),
      logs: renderLogs(state),
    };

    root.innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brand">
            <div class="brand-mark">✈</div>
            <div>
              <strong>سفرك أسهل</strong>
              <small>لوحة الإدارة الداخلية</small>
            </div>
          </div>

          <nav class="nav">
            ${navigation
              .map(
                (item) => `
                  <button class="nav-item ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
                    ${item.label}
                  </button>
                `
              )
              .join('')}
          </nav>

          <div class="sidebar-card">
            <small>الملاحظات السريعة</small>
            <p>النظام الداخلي فقط، لا يظهر للعميل أو المكتب.</p>
          </div>
        </aside>

        <main class="main-panel">
          <header class="topbar">
            <h1>${navigation.find((item) => item.id === currentView)?.label}</h1>
            <button class="primary-btn" data-action="add-booking">إضافة حجز</button>
          </header>
          <div class="content">${content[currentView]}</div>
        </main>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    root.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        currentView = button.dataset.view;
        render();
      });
    });

    root.querySelectorAll('[data-action="add-booking"]').forEach((button) => {
      button.addEventListener('click', () => {
        const state = store.getState();
        const client = state.clients[0];
        const trip = state.trips[0];
        if (!client || !trip) return;

        const newBooking = {
          id: Date.now(),
          clientId: client.id,
          tripId: trip.id,
          status: 'pending',
          amount: 1200,
          createdAt: new Date().toISOString(),
        };

        store.update('bookings', [...state.bookings, newBooking]);
        store.addLog('تمت إضافة حجز جديد يدويًا من لوحة الإدارة');
        currentView = 'bookings';
        render();
      });
    });
  }

  render();
  return { store };
}

function renderDashboard(state, metrics) {
  return `
    <section class="metrics-grid">
      <div class="metric-card">
        <span>المكاتب</span>
        <strong>${metrics.offices}</strong>
        <small>إجمالي المكاتب المسجلة</small>
      </div>
      <div class="metric-card">
        <span>العملاء</span>
        <strong>${metrics.clients}</strong>
        <small>العملاء المسجلين</small>
      </div>
      <div class="metric-card">
        <span>الرحلات</span>
        <strong>${metrics.trips}</strong>
        <small>رحلات التشغيل</small>
      </div>
      <div class="metric-card">
        <span>الحجوزات</span>
        <strong>${metrics.bookings}</strong>
        <small>الطلبات الحالية</small>
      </div>
    </section>

    <section class="panel-grid two-columns">
      <div class="panel">
        <h3>مؤشرات التشغيل</h3>
        <ul class="stats-list">
          <li><span>المكاتب المعتمدة</span><strong>${metrics.approvedOffices}</strong></li>
          <li><span>الرحلات النشطة</span><strong>${metrics.activeTrips}</strong></li>
          <li><span>الحجوزات المعلقة</span><strong>${metrics.pendingBookings}</strong></li>
        </ul>
      </div>

      <div class="panel">
        <h3>آخر السجلات</h3>
        <div class="list-stack">
          ${state.logs.slice(0, 5).map((log) => `<div class="list-row"><span>${new Date(log.createdAt).toLocaleString('ar')}</span><strong>${log.message}</strong></div>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderOffices(state) {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3>قائمة المكاتب</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>المدينة</th>
            <th>الدور</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${state.offices
            .map(
              (office) => `
                <tr>
                  <td>${office.name}</td>
                  <td>${office.city}</td>
                  <td>${office.role}</td>
                  <td><span class="status ${office.status}">${office.status}</span></td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderClients(state) {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3>قائمة العملاء</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الجوال</th>
            <th>المكتب</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${state.clients
            .map((client) => {
              const office = state.offices.find((item) => item.id === client.officeId);
              return `
                <tr>
                  <td>${client.name}</td>
                  <td>${client.phone}</td>
                  <td>${office ? office.name : 'غير محدد'}</td>
                  <td><span class="status ${client.status}">${client.status}</span></td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderTrips(state) {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3>قائمة الرحلات</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>الرحلة</th>
            <th>الجهة</th>
            <th>المكتب</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${state.trips
            .map((trip) => {
              const office = state.offices.find((item) => item.id === trip.officeId);
              return `
                <tr>
                  <td>${trip.title}</td>
                  <td>${trip.from} → ${trip.to}</td>
                  <td>${office ? office.name : 'غير محدد'}</td>
                  <td><span class="status ${trip.status}">${trip.status}</span></td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderBookings(state) {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3>قائمة الحجوزات</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>العميل</th>
            <th>الرحلة</th>
            <th>المبلغ</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${state.bookings
            .map((booking) => {
              const client = state.clients.find((item) => item.id === booking.clientId);
              const trip = state.trips.find((item) => item.id === booking.tripId);
              return `
                <tr>
                  <td>${client ? client.name : 'غير محدد'}</td>
                  <td>${trip ? trip.title : 'غير محدد'}</td>
                  <td>${booking.amount} ر.س</td>
                  <td><span class="status ${booking.status}">${booking.status}</span></td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderLogs(state) {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3>سجل العمليات</h3>
      </div>
      <div class="log-list">
        ${state.logs
          .slice()
          .reverse()
          .map(
            (log) => `
              <div class="log-item">
                <span>${new Date(log.createdAt).toLocaleString('ar')}</span>
                <strong>${log.message}</strong>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}
