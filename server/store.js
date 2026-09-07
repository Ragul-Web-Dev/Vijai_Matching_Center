import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_store.json');

// Default initial data
const initialData = {
  enquiries: [
    {
      id: 'VE-849201',
      refId: 'VE-849201',
      name: 'Priyadarshini R.',
      phone: '+91 98401 23456',
      service: 'Custom Blouse Embroidery',
      message: 'Need peacock zari back neck and grand sleeve work for wedding reception in Chennai. Red silk fabric.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'VE-712903',
      refId: 'VE-712903',
      name: 'Kavitha S.',
      phone: '+91 97904 11223',
      service: 'Saree & Border Embroidery',
      message: 'Scalloped gold zari border for 2 Kanchipuram silk sarees. Salem studio doorstep delivery.',
      image: null,
      status: 'Contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'VE-603194',
      refId: 'VE-603194',
      name: 'Ananya M.',
      phone: '+91 94440 98765',
      service: 'Bridal Embroidery',
      message: 'Full bridal lehenga panel embroidery with antique gold thread.',
      image: null,
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  feedbacks: [
    {
      id: 'FB-101',
      name: 'Meenakshi Sundaram',
      rating: 5,
      service: 'Bridal Blouse Embroidery',
      comment: 'The 12-needle peacock zari embroidery on my bridal blouse back neck came out so sharp! The metallic gold thread shines beautifully under lights.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      video: null,
      status: 'Published',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'FB-102',
      name: 'Divya Bharathi',
      rating: 5,
      service: 'Saree & Border Embroidery',
      comment: 'Delivered continuous 20x32 inch scalloped borders for 3 silk sarees right on schedule. No visible joint lines or thread puckering!',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      video: null,
      status: 'Published',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'FB-103',
      name: 'Radhika Nair',
      rating: 5,
      service: 'Logo & Uniform Embroidery',
      comment: 'Had 100 polo shirts embroidered with our company logo emblem. Clean lettering and durable color-fast thread.',
      image: null,
      video: null,
      status: 'Published',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    }
  ]
};

// Load data helper
export const loadData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Store Read Error]:', err.message);
    return initialData;
  }
};

// Save data helper
export const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Store Write Error]:', err.message);
    return false;
  }
};
