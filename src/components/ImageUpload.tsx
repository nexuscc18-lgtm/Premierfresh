import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  productName?: string;
}

export default function ImageUpload({ currentUrl, onUpload, productName }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setUploading(true);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filename, file, { upsert: false });

    if (uploadError) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    onUpload(urlData.publicUrl);
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleClear() {
    onUpload('');
  }

  const hasImage = Boolean(currentUrl);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-700">Product Image</label>

      {/* Preview */}
      {hasImage && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
          <img
            src={currentUrl}
            alt={productName || 'Product'}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = ''; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-neutral-800 text-xs font-bold px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
            >
              <Upload size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-brand-red text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-brand-red-dark transition-colors flex items-center gap-1.5"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone (shown when no image) */}
      {!hasImage && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative w-full h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            dragging
              ? 'border-brand-blue bg-brand-blue/5'
              : 'border-neutral-300 bg-neutral-50 hover:border-brand-blue hover:bg-brand-blue/5'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-brand-blue animate-spin" />
              <p className="text-sm font-medium text-neutral-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
                <ImageIcon size={20} className="text-neutral-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-600">
                  {dragging ? 'Drop image here' : 'Click or drag to upload'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">JPEG, PNG, WebP &mdash; max 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* OR paste URL row */}
      {!hasImage && !uploading && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400 font-medium">or paste URL</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>
      )}

      {/* URL input fallback */}
      {!uploading && (
        <input
          type="url"
          value={hasImage && !currentUrl.startsWith('blob:') ? currentUrl : ''}
          onChange={e => onUpload(e.target.value)}
          placeholder="https://..."
          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white placeholder-neutral-400"
        />
      )}

      {error && (
        <p className="text-xs text-error bg-error-light rounded-lg px-3 py-2">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
