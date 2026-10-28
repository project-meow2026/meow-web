'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, Check, X, FolderTree, LayoutGrid } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { SketchIllustration } from '@/components/common/SketchIllustration';
import { dbService } from '@/lib/storage/db';
import { Category } from '@/lib/supabase/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const loadCategories = async () => {
    try {
      const data = await dbService.getAllCategoriesAdmin();
      setCategories(data);
    } catch (e) {
      console.error('Error loading categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      sketch_image_url: '',
      banner_image_url: '',
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      await dbService.saveCategory(editingCategory);
      setIsModalOpen(false);
      setEditingCategory(null);
      await loadCategories();
      showToast('Category saved successfully.');
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      await dbService.deleteCategory(id);
      await loadCategories();
      showToast('Category deleted.');
    }
  };

  return (
    <div>
      <AdminHeader
        title="Category & Collection Management"
        description="Configure the 6 MEOW homepage circular categories, or open Collections Page CMS to manage the /collections page banners and 6 cards."
        actionButton={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/collections"
              className="flex items-center gap-2 px-3.5 py-2 border border-meow-border bg-white text-meow-dark text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-surface transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Collections Page CMS</span>
            </Link>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection</span>
            </button>
          </div>
        }
      />

      {toastMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="border border-meow-border rounded-xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left divide-y divide-meow-border">
          <thead className="bg-[#FAF9F6] text-meow-dark uppercase font-semibold">
            <tr>
              <th className="px-6 py-3.5">Order</th>
              <th className="px-6 py-3.5">Sketch Icon</th>
              <th className="px-6 py-3.5">Collection Name</th>
              <th className="px-6 py-3.5">Slug</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meow-border/60">
            {categories.map((cat) => (
              <tr key={cat.id || cat.slug} className="hover:bg-meow-surface">
                <td className="px-6 py-4 font-mono font-bold text-meow-dark">
                  {cat.display_order}
                </td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center p-1.5 overflow-hidden">
                    {(cat.sketch_image_url || cat.banner_image_url) ? (
                      <img
                        src={(cat.sketch_image_url || cat.banner_image_url)!}
                        alt={cat.name}
                        className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply drop-shadow-sm"
                      />
                    ) : (
                      <div className="text-[10px] font-bold text-meow-dark uppercase">
                        {cat.name.slice(0, 3)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-sm text-meow-dark block">{cat.name}</span>
                  <span className="text-[11px] text-meow-muted line-clamp-1">{cat.description}</span>
                </td>
                <td className="px-6 py-4 font-mono text-meow-muted">
                  {cat.slug}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      cat.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-meow-dark hover:bg-meow-surface rounded border border-meow-border"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-meow-border">
              <h2 className="text-base font-semibold uppercase tracking-wider text-meow-dark">
                {editingCategory.id ? 'Edit Collection' : 'Create New Collection'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-meow-muted hover:text-meow-dark">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  placeholder="e.g. EVA for Women"
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-meow-dark block mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-meow-dark block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCategory.display_order || 1}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, display_order: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Anatomical footbed details, comfort features, materials..."
                  className="w-full text-xs p-3 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>

              {/* Category Display Image / Illustration */}
              <div className="pt-2">
                <ImageUploader
                  label="Category Image / Illustration (Shown on Homepage & Storefront)"
                  folder="meow/categories"
                  value={editingCategory.sketch_image_url || editingCategory.banner_image_url || ''}
                  aspectRatio="aspect-square"
                  onChange={(url) => setEditingCategory({ ...editingCategory, sketch_image_url: url, banner_image_url: url })}
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={editingCategory.is_active ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                  className="rounded border-meow-border accent-meow-dark w-4 h-4"
                />
                <label htmlFor="cat-active" className="text-xs font-medium text-meow-dark cursor-pointer">
                  Publish on Storefront
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-meow-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-meow-border text-meow-dark text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
