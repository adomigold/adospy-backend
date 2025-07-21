import ReactDOM from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import './index.css';

createInertiaApp({
  resolve: name => {
    const pages: Record<string, any> = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    return pages[`./Pages/${name}.tsx`]?.default;
  },
  setup({ el, App, props }) {
    const root = ReactDOM.createRoot(el);
    root.render(<App {...props} />);
  },
});
