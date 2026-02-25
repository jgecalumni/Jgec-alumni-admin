"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { 
  Plus, Trash2, Video, X, Loader2, Newspaper, 
  Edit3, MapPin, Calendar, Image as ImageIcon, 
  Camera, Search, Globe, Filter, MoreHorizontal,
  CheckCircle2, AlertCircle, Trash
} from "lucide-react";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Media { id: number; type: "image" | "youtube" | "facebook"; url: string; }
interface NewsItem { id: number; title: string; tag: string; excerpt: string; date: string; location: string; media: Media[]; }

const API_BASE_URL = "http://localhost:8000/v1/api/media_press";

export default function MediaPressAdmin() {
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Logic States
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<Media[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<{id?: number, type: "youtube" | "facebook", url: string}[]>([]);
  
  const [formData, setFormData] = useState({
    title: "", tag: "Event", excerpt: "", 
    date: new Date().toISOString().split('T')[0], 
    location: "JGEC Campus" 
  });

  useEffect(() => { fetchNews(); }, []);

  // --- READ ---
  const fetchNews = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setNewsList(data.data || data);
    } catch (err) { console.error("Fetch failed"); }
  };

  // --- DELETE ---
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchNews();
    } catch (err) { console.error("Deletion failed:", err); }
  };

  // --- CREATE & UPDATE ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API_BASE_URL}/${editId}` : API_BASE_URL;
    const method = editId ? "PATCH" : "POST";

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("tag", formData.tag);
      data.append("excerpt", formData.excerpt);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("videoLinks", JSON.stringify(videoLinks));
      data.append("deleteMediaIds", JSON.stringify(deleteMediaIds));
      
      newImages.forEach(file => data.append("images", file));

      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        fetchNews();
        resetStates();
      }
    } catch (err) { console.error("Submit failed:", err); }
    finally { setLoading(false); }
  };

  const resetStates = () => {
    setEditId(null);
    setDeleteMediaIds([]);
    setExistingImages([]);
    setNewImages([]);
    setVideoLinks([]);
    setFormData({ 
      title: "", tag: "Event", excerpt: "", 
      date: new Date().toISOString().split('T')[0], 
      location: "JGEC Campus" 
    });
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditId(item.id);
    setFormData({ title: item.title, tag: item.tag, excerpt: item.excerpt, date: item.date, location: item.location });
    setExistingImages(item.media.filter(m => m.type === 'image'));
    setVideoLinks(item.media.filter(m => m.type !== 'image').map(m => ({ id: m.id, type: m.type as "youtube" | "facebook", url: m.url })));
    setDeleteMediaIds([]);
    setNewImages([]);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    resetStates();
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 bg-[#F9FBFC] min-h-screen">
      
      {/* --- TOP HEADER --- */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#5f7dcc] p-2 rounded-lg text-white">
            <Newspaper size={18} />
          </div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">Media & Press Release</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              placeholder="Search archive..." 
              className="bg-slate-100 border-none rounded-full py-2 pl-9 pr-4 text-xs w-64 outline-none focus:ring-1 ring-blue-500"
            />
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="bg-[#5f7dcc] text-white hover:bg-blue-700 rounded-xl px-6 shadow-md shadow-blue-100 transition-all active:scale-95">
            <Plus size={16} className="mr-2" /> Create
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">News Archive</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage and curate campus news stories.</p>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
              <div className="relative aspect-video bg-slate-50 overflow-hidden">
                <img 
                  src={item.media.find(m => m.type === 'image')?.url || "https://placehold.co/600x400/f1f5f9/94a3b8?text=NO+IMAGE"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-black uppercase text-[#5f7dcc] shadow-sm border border-blue-50">
                  {item.tag}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug text-lg group-hover:text-[#5f7dcc] transition-colors">{item.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-50 transition-all rounded-lg">
                        <MoreHorizontal size={18}/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-100 bg-white p-1">
                      <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="cursor-pointer font-bold py-2 text-slate-600 rounded-lg">
                        <Edit3 size={14} className="mr-2 text-blue-500"/> Edit Article
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-600 cursor-pointer font-bold py-2 rounded-lg">
                        <Trash2 size={14} className="mr-2"/> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">{item.excerpt}</p>
                
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 border-t border-slate-50 pt-4 uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-slate-300"/> {item.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-300"/> {item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {newsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm px-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} className="text-blue-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Press Releases Yet</h3>
            <p className="text-slate-500 max-w-sm text-sm font-medium mb-8">
              Document alumni achievements or upcoming skill development seminars here to keep the community informed and engaged.
            </p>
            <Button onClick={handleOpenCreate} className="rounded-2xl bg-[#5f7dcc] hover:bg-blue-700 px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 text-white transition-all active:scale-95">
              <Plus size={16} className="mr-2" /> Publish Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white animate-in zoom-in-95 duration-200">
          <DialogHeader className="p-8 pb-6 border-b border-slate-50 bg-white">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-[#5f7dcc] shadow-sm">
                <Edit3 size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  {editId ? "Update Dispatch" : "Draft New Article"}
                </DialogTitle>
                <p className="text-slate-400 text-sm font-medium">Capture alumni success and campus events.</p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Headline</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Skill Development Seminar 2026..." 
                    className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold transition-all placeholder:text-slate-300" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                    <Select value={formData.tag} onValueChange={(val) => setFormData({...formData, tag: val})}>
                      <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl">
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Notice">Notice</SelectItem>
                        <SelectItem value="Achievement">Achievement</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</Label>
                    <Input 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Excerpt</Label>
                  <Textarea 
                    rows={4} 
                    value={formData.excerpt} 
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Write a catchy summary..." 
                    className="rounded-2xl bg-slate-50 border-slate-100 focus:bg-white text-sm font-medium leading-relaxed resize-none p-4 transition-all" 
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block flex items-center gap-2">
                    <Camera size={14} className="text-blue-500" /> Gallery Assets
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map(img => (
                      <div key={img.id} className="aspect-square bg-white rounded-xl border border-slate-200 relative group overflow-hidden shadow-sm">
                        <img src={img.url} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => {
                          setDeleteMediaIds(prev => [...prev, img.id]);
                          setExistingImages(prev => prev.filter(i => i.id !== img.id));
                        }} className="absolute inset-0 bg-red-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Trash size={16}/>
                        </button>
                      </div>
                    ))}
                    {newImages.map((file, i) => (
                      <div key={i} className="aspect-square bg-blue-50/50 rounded-xl border border-blue-100 relative group overflow-hidden">
                         <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                         <button type="button" onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white shadow-sm text-red-500 rounded-full p-1 shadow-sm">
                           <X size={10}/>
                         </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all text-slate-300 hover:text-blue-500">
                      <Plus size={20} />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && setNewImages([...newImages, ...Array.from(e.target.files)])} />
                    </label>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block flex items-center gap-2">
                    <Video size={14} className="text-blue-500" /> Broadcasts
                  </Label>
                  <div className="space-y-2">
                    {videoLinks.map((link, i) => (
                      <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <select 
                          value={link.type}
                          className="text-[9px] font-black text-[#5f7dcc] bg-blue-50 p-1 rounded uppercase outline-none"
                          onChange={(e) => {
                            const up = [...videoLinks];
                            up[i].type = e.target.value as "youtube" | "facebook";
                            setVideoLinks(up);
                          }}
                        >
                          <option value="youtube">YT</option>
                          <option value="facebook">FB</option>
                        </select>
                        <input 
                          placeholder="Paste link..."
                          value={link.url} 
                          onChange={(e) => {
                            const up = [...videoLinks];
                            up[i].url = e.target.value;
                            setVideoLinks(up);
                          }}
                          className="bg-transparent border-none text-[11px] font-bold outline-none flex-1 truncate text-slate-600" 
                        />
                        <X size={14} className="text-slate-300 hover:text-red-500 cursor-pointer shrink-0" onClick={() => setVideoLinks(videoLinks.filter((_, idx) => idx !== i))} />
                      </div>
                    ))}
                    <Button type="button" variant="ghost" className="w-full py-2 h-auto border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-[#5f7dcc] transition-all" onClick={() => setVideoLinks([...videoLinks, { type: "youtube", url: "" }])}>
                      + Add Stream Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 border-t border-slate-50 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 text-slate-400 hover:bg-slate-50 transition-all">Cancel</Button>
              <Button disabled={loading} type="submit" className="rounded-2xl bg-[#5f7dcc] hover:bg-blue-700 px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 text-white transition-all active:scale-95">
                {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <CheckCircle2 className="mr-2" size={16}/>}
                {editId ? "Update Dispatch" : "Publish Dispatch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}