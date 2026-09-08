import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const ProgressGallery = () => {
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', date: '2026-04-01', label: 'Start' },
    { id: 2, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', date: '2026-05-01', label: '1 Month' },
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const confirmUpload = () => {
    const newPhoto = {
      id: Date.now(),
      url: previewImage,
      date: new Date().toISOString().split('T')[0],
      label: 'New Update'
    };
    setPhotos([...photos, newPhoto]);
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">Progress Gallery</h2>
          <p className="text-textMuted font-medium uppercase tracking-widest text-[10px]">Track your physical transformation</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20"
        >
          <Plus size={20} /> Add Photo
        </button>
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            layoutId={`photo-${photo.id}`}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer glass border-none"
          >
            <img 
              src={photo.url} 
              alt={photo.label} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <span className="text-white font-black text-lg">{photo.label}</span>
              <span className="text-white/70 text-xs font-bold flex items-center gap-1">
                <Calendar size={12} /> {new Date(photo.date).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
        
        {/* Placeholder for new upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-[32px] border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-textMuted hover:border-accent hover:text-accent transition-all cursor-pointer group"
        >
          <div className="p-4 rounded-full bg-surface/50 group-hover:bg-accent/10 transition-colors">
            <Camera size={32} />
          </div>
          <span className="font-bold text-xs uppercase tracking-widest">Upload New</span>
        </div>
      </div>

      {/* Comparison View */}
      <div className="glass p-8 rounded-[40px] flex flex-col gap-8">
        <h3 className="text-xl font-black flex items-center gap-2">
          <ImageIcon className="text-accent" /> Side-by-Side Comparison
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-widest text-center">Initial</span>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden glass">
              {photos.length > 0 ? (
                <img src={photos[0].url} className="w-full h-full object-cover" alt="Before" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-textMuted font-bold">No Photos</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest text-center">Current</span>
            <div className="aspect-[3/4] rounded-3xl overflow-hidden glass border-accent/20">
              {photos.length > 0 ? (
                <img src={photos[photos.length - 1].url} className="w-full h-full object-cover" alt="After" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-textMuted font-bold">No Photos</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              layoutId={`photo-${selectedPhoto.id}`}
              className="relative max-w-4xl w-full aspect-[3/4] rounded-[48px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedPhoto.url} className="w-full h-full object-cover" alt={selectedPhoto.label} />
              <div className="absolute top-8 right-8 flex gap-4">
                <button 
                  onClick={() => {
                    setPhotos(photos.filter(p => p.id !== selectedPhoto.id));
                    setSelectedPhoto(null);
                  }}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 size={24} />
                </button>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="absolute bottom-12 left-12 text-white">
                <h4 className="text-4xl font-black mb-2">{selectedPhoto.label}</h4>
                <p className="text-xl opacity-70 font-bold">{new Date(selectedPhoto.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 rounded-[40px] flex flex-col gap-8 max-w-sm w-full"
            >
              <h3 className="text-2xl font-black text-center">Preview Photo</h3>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden glass border-accent/20">
                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpload}
                  className="flex-1 py-4 rounded-2xl font-bold bg-accent text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressGallery;
