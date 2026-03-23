import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  Settings, Package, Image as ImageIcon, Pencil, Trash2, 
  Plus, Upload, Save, ArrowLeft, MessageSquare, Star
} from "lucide-react";
import { toast, Toaster } from "sonner";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function Admin() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customerName: "", rating: 5, reviewText: "" });

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    category: "LED Lights",
    price: "",
    originalPrice: "",
    description: "",
    imageUrl: "",
    rating: "5.0",
    reviewCount: "0",
    inStock: true,
    badge: ""
  });

  const [settingsForm, setSettingsForm] = useState({
    businessName: "",
    tagline: "",
    address: "",
    phone1: "",
    phone2: "",
    whatsapp: "",
    email: "",
    mapEmbed: "",
    logoUrl: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const CATEGORIES = ["LED Lights", "Fans", "Solar Products"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, productsRes, reviewsRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/products'),
        fetch('/api/admin/reviews')
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setSettingsForm({
          businessName: settingsData.businessName || "",
          tagline: settingsData.tagline || "",
          address: settingsData.address || "",
          phone1: settingsData.phone1 || "",
          phone2: settingsData.phone2 || "",
          whatsapp: settingsData.whatsapp || "",
          email: settingsData.email || "",
          mapEmbed: settingsData.mapEmbed || "",
          logoUrl: settingsData.logoUrl || ""
        });
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Review deleted');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Error deleting review');
    }
  };

  const handleAddReview = async () => {
    if (!reviewForm.customerName.trim() || !reviewForm.reviewText.trim()) {
      toast.error('Name and review text are required');
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      if (!res.ok) throw new Error('Failed to add review');
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setIsReviewModalOpen(false);
      setReviewForm({ customerName: "", rating: 5, reviewText: "" });
      toast.success('Review added successfully');
    } catch {
      toast.error('Error adding review');
    }
  };

  const handleSettingsSave = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Business info updated successfully');
      setSettings(settingsForm);
    } catch (err) {
      toast.error('Error saving business info');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const newSettings = { ...settingsForm, logoUrl: url };
      setSettingsForm(newSettings);

      const saveRes = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });

      if (!saveRes.ok) throw new Error('Failed to save logo setting');
      setSettings(newSettings);
      toast.success('Logo updated successfully');
    } catch (err) {
      toast.error('Error uploading logo');
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();
      
      setProductForm(prev => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Error uploading image');
    }
  };

  const openProductModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || "",
        category: product.category || "LED Lights",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        rating: product.rating?.toString() || "5.0",
        reviewCount: product.reviewCount?.toString() || "0",
        inStock: product.inStock ?? true,
        badge: product.badge || ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "LED Lights",
        price: "",
        originalPrice: "",
        description: "",
        imageUrl: "",
        rating: "5.0",
        reviewCount: "0",
        inStock: true,
        badge: ""
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSave = async () => {
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        rating: parseFloat(productForm.rating) || 5.0,
        reviewCount: parseInt(productForm.reviewCount) || 0,
      };

      const isEdit = !!editingProduct;
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');
      
      toast.success(isEdit ? 'Product updated' : 'Product created');
      setIsProductModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      toast.error('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 font-sans pb-12">
      <Toaster position="top-right" />
      
      {/* Admin Header */}
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              <Settings className="h-5 w-5" />
              EcoBright Admin
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted/50 w-full sm:w-auto overflow-x-auto flex-nowrap justify-start h-auto">
            <TabsTrigger value="products" className="py-2 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="business" className="py-2 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary">
              <Settings className="h-4 w-4" />
              Business Info
            </TabsTrigger>
            <TabsTrigger value="branding" className="py-2 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary">
              <ImageIcon className="h-4 w-4" />
              Logo & Branding
            </TabsTrigger>
            <TabsTrigger value="reviews" className="py-2 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary">
              <MessageSquare className="h-4 w-4" />
              Reviews
              {reviews.length > 0 && (
                <span className="ml-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{reviews.length}</span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Products Management</h2>
              <Button onClick={() => openProductModal()} className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>

            <Card className="border-none shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No products found. Click "Add Product" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex items-center justify-center border">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>
                            {p.category}
                          </TableCell>
                          <TableCell>₹{p.price}</TableCell>
                          <TableCell>
                            {p.inStock ? (
                              <Badge className="bg-green-500 hover:bg-green-600 text-white border-transparent">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {p.badge && <Badge variant="outline" className="border-secondary text-secondary-foreground">{p.badge}</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openProductModal(p)} className="h-8 px-2">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p.id)} className="h-8 px-2">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* BUSINESS INFO TAB */}
          <TabsContent value="business" className="space-y-4 outline-none">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Business Information</h2>
            
            <Card className="border-none shadow-sm max-w-3xl">
              <CardHeader>
                <CardTitle>Contact & Details</CardTitle>
                <CardDescription>
                  Update your business name, contact information, and address displayed on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      value={settingsForm.businessName} 
                      onChange={e => setSettingsForm({...settingsForm, businessName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input 
                      id="tagline" 
                      value={settingsForm.tagline} 
                      onChange={e => setSettingsForm({...settingsForm, tagline: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone1">Phone 1</Label>
                    <Input 
                      id="phone1" 
                      value={settingsForm.phone1} 
                      onChange={e => setSettingsForm({...settingsForm, phone1: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone2">Phone 2 (Optional)</Label>
                    <Input 
                      id="phone2" 
                      value={settingsForm.phone2} 
                      onChange={e => setSettingsForm({...settingsForm, phone2: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input 
                      id="whatsapp" 
                      value={settingsForm.whatsapp} 
                      onChange={e => setSettingsForm({...settingsForm, whatsapp: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={settingsForm.email} 
                      onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea 
                    id="address" 
                    rows={3}
                    value={settingsForm.address} 
                    onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mapEmbed">Google Maps Embed URL</Label>
                  <Textarea 
                    id="mapEmbed" 
                    rows={3}
                    placeholder="https://maps.google.com/maps?q=..."
                    value={settingsForm.mapEmbed} 
                    onChange={e => setSettingsForm({...settingsForm, mapEmbed: e.target.value})} 
                  />
                  <p className="text-xs text-muted-foreground">Paste the entire iframe tag or just the src URL from Google Maps.</p>
                </div>

                <Button onClick={handleSettingsSave} className="w-full sm:w-auto gap-2">
                  <Save className="h-4 w-4" /> Save Business Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGO & BRANDING TAB */}
          <TabsContent value="branding" className="space-y-4 outline-none">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Logo & Branding</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Website Logo</CardTitle>
                  <CardDescription>Upload your brand's primary logo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30">
                    {settingsForm.logoUrl ? (
                      <div className="relative group w-48 h-24 mb-4 flex items-center justify-center bg-white rounded-md p-4 shadow-sm">
                        <img src={settingsForm.logoUrl} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoUpload} 
                    />
                    <Button variant="outline" onClick={() => logoInputRef.current?.click()} className="gap-2">
                      <Upload className="h-4 w-4" /> 
                      {settingsForm.logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Recommended size: 200x80px. PNG or SVG.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>Current color palette configured in CSS.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#0F3D3E] shadow-sm"></div>
                        <div>
                          <p className="font-medium text-sm">Primary</p>
                          <p className="text-xs text-muted-foreground">Deep Green</p>
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">#0F3D3E</code>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#F4B400] shadow-sm"></div>
                        <div>
                          <p className="font-medium text-sm">Secondary / Accent</p>
                          <p className="text-xs text-muted-foreground">Warm Yellow</p>
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">#F4B400</code>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 flex items-start gap-2">
                      <div className="mt-0.5"><Settings className="h-4 w-4" /></div>
                      <p>To change brand colors, edit the HSL variables in the <code className="bg-white/50 px-1 rounded">index.css</code> file.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews" className="space-y-4 outline-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Customer Reviews</h2>
                <p className="text-sm text-muted-foreground mt-1">{reviews.length} total review{reviews.length !== 1 ? 's' : ''}</p>
              </div>
              <Button onClick={() => { setReviewForm({ customerName: "", rating: 5, reviewText: "" }); setIsReviewModalOpen(true); }} className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Review
              </Button>
            </div>

            <Card className="border-none shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[180px]">Customer</TableHead>
                      <TableHead className="w-[120px]">Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead className="w-[140px]">Date</TableHead>
                      <TableHead className="text-right w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No reviews yet. Add the first one!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.customerName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-[#F4B400] text-[#F4B400]' : 'text-muted-foreground/30'}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">({r.rating}/5)</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm line-clamp-2 max-w-md">{r.reviewText}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteReview(r.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Add/Edit Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select 
                  id="category"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={productForm.category}
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origPrice">Original Price</Label>
                  <Input 
                    id="origPrice" 
                    type="number"
                    value={productForm.originalPrice} 
                    onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge (e.g. Bestseller)</Label>
                <Input 
                  id="badge" 
                  value={productForm.badge} 
                  onChange={e => setProductForm({...productForm, badge: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input 
                    id="rating" 
                    type="number" step="0.1" min="0" max="5"
                    value={productForm.rating} 
                    onChange={e => setProductForm({...productForm, rating: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviews">Review Count</Label>
                  <Input 
                    id="reviews" 
                    type="number"
                    value={productForm.reviewCount} 
                    onChange={e => setProductForm({...productForm, reviewCount: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Image *</Label>
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-muted/20 h-40">
                  {productForm.imageUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center group">
                      <img src={productForm.imageUrl} alt="Preview" className="max-h-full object-contain rounded" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Upload Image
                      </Button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProductImageUpload} 
                  />
                </div>
                <Input 
                  placeholder="Or paste image URL" 
                  value={productForm.imageUrl} 
                  onChange={e => setProductForm({...productForm, imageUrl: e.target.value})}
                  className="mt-2 text-xs"
                />
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  rows={4}
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})} 
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t">
                <Checkbox 
                  id="inStock" 
                  checked={productForm.inStock} 
                  onCheckedChange={(checked) => setProductForm({...productForm, inStock: checked as boolean})}
                />
                <Label htmlFor="inStock" className="cursor-pointer">Product is in stock</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
            <Button onClick={handleProductSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Add Customer Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rev-name">Customer Name *</Label>
              <Input
                id="rev-name"
                placeholder="e.g. Rajesh Patel"
                value={reviewForm.customerName}
                onChange={e => setReviewForm({ ...reviewForm, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Star Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${star <= reviewForm.rating ? 'fill-[#F4B400] text-[#F4B400]' : 'text-muted-foreground/30'}`}
                    />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground ml-1">{reviewForm.rating}/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-text">Review Text *</Label>
              <Textarea
                id="rev-text"
                rows={4}
                placeholder="Customer's review about the product or service..."
                value={reviewForm.reviewText}
                onChange={e => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddReview} className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" /> Save Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
