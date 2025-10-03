import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save } from "lucide-react";

interface Page {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  schemaMarkup: Record<string, any> | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PageSection {
  id: string;
  pageId: string;
  type: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  order: string;
  data: Record<string, any> | null;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  page: string | null;
  order: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ContentManagementPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pages");
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [pagePublished, setPagePublished] = useState(true);
  const [faqPublished, setFaqPublished] = useState(true);

  // Fetch pages
  const { data: pages = [], isLoading: pagesLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  // Fetch FAQs
  const { data: faqs = [], isLoading: faqsLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  // Page mutations
  const createPageMutation = useMutation({
    mutationFn: (data: Partial<Page>) => apiRequest("/api/pages", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page created successfully" });
      setIsPageDialogOpen(false);
      setEditingPage(null);
    },
    onError: () => {
      toast({ title: "Failed to create page", variant: "destructive" });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Page> & { id: string }) =>
      apiRequest(`/api/pages/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page updated successfully" });
      setIsPageDialogOpen(false);
      setEditingPage(null);
    },
    onError: () => {
      toast({ title: "Failed to update page", variant: "destructive" });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/pages/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete page", variant: "destructive" });
    },
  });

  // FAQ mutations
  const createFaqMutation = useMutation({
    mutationFn: (data: Partial<Faq>) => apiRequest("/api/faqs", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: "FAQ created successfully" });
      setIsFaqDialogOpen(false);
      setEditingFaq(null);
    },
    onError: () => {
      toast({ title: "Failed to create FAQ", variant: "destructive" });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Faq> & { id: string }) =>
      apiRequest(`/api/faqs/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: "FAQ updated successfully" });
      setIsFaqDialogOpen(false);
      setEditingFaq(null);
    },
    onError: () => {
      toast({ title: "Failed to update FAQ", variant: "destructive" });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/faqs/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: "FAQ deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    },
  });

  const handleSavePage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      metaDescription: formData.get("metaDescription") as string || null,
      metaKeywords: formData.get("metaKeywords") as string || null,
      ogTitle: formData.get("ogTitle") as string || null,
      ogDescription: formData.get("ogDescription") as string || null,
      ogImage: formData.get("ogImage") as string || null,
      isPublished: pagePublished,
    };

    if (editingPage?.id) {
      updatePageMutation.mutate({ id: editingPage.id, ...data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  const handleSaveFaq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: formData.get("category") as string,
      page: formData.get("page") as string || null,
      order: formData.get("order") as string || "0",
      isPublished: faqPublished,
    };

    if (editingFaq?.id) {
      updateFaqMutation.mutate({ id: editingFaq.id, ...data });
    } else {
      createFaqMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Content Management</h1>
          <p className="text-muted-foreground">Manage pages, sections, FAQs, and SEO metadata</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pages" data-testid="tab-pages">Pages</TabsTrigger>
          <TabsTrigger value="faqs" data-testid="tab-faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingPage(null); setPagePublished(true); }} data-testid="button-add-page">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSavePage}>
                  <DialogHeader>
                    <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
                    <DialogDescription>
                      Manage page content, SEO metadata, and Open Graph tags
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        name="slug"
                        defaultValue={editingPage?.slug}
                        placeholder="about-us"
                        required
                        data-testid="input-slug"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingPage?.title}
                        placeholder="About Us"
                        required
                        data-testid="input-title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        defaultValue={editingPage?.metaDescription || ""}
                        placeholder="Page description for search engines"
                        data-testid="input-meta-description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        name="metaKeywords"
                        defaultValue={editingPage?.metaKeywords || ""}
                        placeholder="keyword1, keyword2, keyword3"
                        data-testid="input-meta-keywords"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ogTitle">Open Graph Title</Label>
                      <Input
                        id="ogTitle"
                        name="ogTitle"
                        defaultValue={editingPage?.ogTitle || ""}
                        placeholder="Title for social media sharing"
                        data-testid="input-og-title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ogDescription">Open Graph Description</Label>
                      <Textarea
                        id="ogDescription"
                        name="ogDescription"
                        defaultValue={editingPage?.ogDescription || ""}
                        placeholder="Description for social media sharing"
                        data-testid="input-og-description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ogImage">Open Graph Image URL</Label>
                      <Input
                        id="ogImage"
                        name="ogImage"
                        defaultValue={editingPage?.ogImage || ""}
                        placeholder="https://example.com/image.jpg"
                        data-testid="input-og-image"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublished"
                        checked={pagePublished}
                        onCheckedChange={setPagePublished}
                        data-testid="switch-is-published"
                      />
                      <Label htmlFor="isPublished">Published</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" data-testid="button-save-page">
                      <Save className="mr-2 h-4 w-4" />
                      Save Page
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {pagesLoading ? (
            <div className="text-center py-8">Loading pages...</div>
          ) : (
            <div className="grid gap-4">
              {pages.map((page: Page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {page.title}
                          {!page.isPublished && (
                            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                              Draft
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>/{page.slug}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPage(page);
                            setPagePublished(page.isPublished);
                            setIsPageDialogOpen(true);
                          }}
                          data-testid={`button-edit-page-${page.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePageMutation.mutate(page.id)}
                          data-testid={`button-delete-page-${page.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {page.metaDescription && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{page.metaDescription}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingFaq(null); setFaqPublished(true); }} data-testid="button-add-faq">
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleSaveFaq}>
                  <DialogHeader>
                    <DialogTitle>{editingFaq ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
                    <DialogDescription>
                      Add frequently asked questions to your knowledge base
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="question">Question *</Label>
                      <Input
                        id="question"
                        name="question"
                        defaultValue={editingFaq?.question}
                        required
                        data-testid="input-question"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="answer">Answer *</Label>
                      <Textarea
                        id="answer"
                        name="answer"
                        defaultValue={editingFaq?.answer}
                        required
                        rows={4}
                        data-testid="input-answer"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        name="category"
                        defaultValue={editingFaq?.category}
                        required
                        placeholder="General, Pricing, Installation, etc."
                        data-testid="input-category"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="page">Page (optional)</Label>
                      <Input
                        id="page"
                        name="page"
                        defaultValue={editingFaq?.page || ""}
                        placeholder="home, services, etc."
                        data-testid="input-page"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={editingFaq?.order || "0"}
                        data-testid="input-order"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublished"
                        checked={faqPublished}
                        onCheckedChange={setFaqPublished}
                        data-testid="switch-faq-published"
                      />
                      <Label htmlFor="isPublished">Published</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" data-testid="button-save-faq">
                      <Save className="mr-2 h-4 w-4" />
                      Save FAQ
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {faqsLoading ? (
            <div className="text-center py-8">Loading FAQs...</div>
          ) : (
            <div className="grid gap-4">
              {faqs.map((faq: Faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {faq.question}
                          {!faq.isPublished && (
                            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                              Draft
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Category: {faq.category}
                          {faq.page && ` • Page: ${faq.page}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqPublished(faq.isPublished);
                            setIsFaqDialogOpen(true);
                          }}
                          data-testid={`button-edit-faq-${faq.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFaqMutation.mutate(faq.id)}
                          data-testid={`button-delete-faq-${faq.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
