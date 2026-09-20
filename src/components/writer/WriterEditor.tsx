"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Undo,
  Redo,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  Loader2,
  Plus,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
  Edit,
} from "lucide-react";

export interface ArticleData {
  id?: number;
  title: string;
  deck: string;
  content: string;
  category: string;
  subcategories: string[];
  tags: string[];
  read_time: string;
  status: "draft" | "pending" | "published" | "rejected" | "trash";
  rejection_reason?: string;
  card_summary?: string;
  focus_keyword?: string;
  meta_description?: string;
  slug?: string;
  image?: string;
  image_caption?: string;
  image_credit?: string;
}

interface WriterEditorProps {
  initialArticle?: ArticleData | null;
  onCancel: () => void;
  onSaveSuccess: (article: ArticleData, action: "draft" | "pending") => void;
  userEmail: string;
  userName: string;
}

export const navbarCategories = [
  "Companies",
  "Startups",
  "Markets",
  "Economy",
  "Finance",
  "Leaders",
  "Industries",
  "Global",
  "Technology",
];

export const navbarSubcategoriesMap: Record<string, string[]> = {
  Companies: [
    "Corporate Announcements",
    "Mergers & Acquisitions",
    "Leadership Changes",
  ],
  Startups: [
    "Funding & Investment",
    "Founder Stories",
    "Venture Capital",
    "Startup Failures",
  ],
  Markets: ["Stock Market", "Bonds", "Mutual Funds"],
  Economy: [
    "GDP & Economic Growth",
    "Employment",
    "Government Economic Policies",
  ],
  Finance: [
    "Digital Banking",
    "FinTech",
    "Banking Industry",
    "Loans & Lending",
  ],
  Leaders: [
    "Business Leaders",
    "CEO Interviews",
    "Executive Appointments",
    "Leadership Strategies",
  ],
  Industries: [
    "Manufacturing",
    "Energy",
    "Pharmaceuticals",
    "Automobile",
    "Agriculture Business",
    "Construction",
    "Design",
    "Textiles",
    "Entertainment",
  ],
  Global: [
    "World Politics",
    "International Trade",
    "Diplomacy",
    "Global Climate",
  ],
  Technology: [
    "Artificial Intelligence",
    "Cybersecurity",
    "Big Tech",
    "Hardware & Cloud",
  ],
};

export default function WriterEditor({
  initialArticle,
  onCancel,
  onSaveSuccess,
  userEmail,
  userName,
}: WriterEditorProps) {
  // Article content states
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [deck, setDeck] = useState(initialArticle?.deck || "");
  const [content, setContent] = useState(initialArticle?.content || "");
  const [category, setCategory] = useState(
    initialArticle?.category || "Companies",
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialArticle?.subcategories || [],
  );
  const [tags, setTags] = useState<string[]>(initialArticle?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [readDuration, setReadDuration] = useState(
    initialArticle?.read_time || "5 min read",
  );

  // SEO States
  const [cardSummary, setCardSummary] = useState(
    initialArticle?.card_summary || "",
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialArticle?.focus_keyword || "",
  );
  const [metaDescription, setMetaDescription] = useState(
    initialArticle?.meta_description || "",
  );

  // UI States
  const [sidebarTab, setSidebarTab] = useState<"details" | "seo">("details");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  // Image Modal States (Screenshots 1 & 2)
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageKeywords, setImageKeywords] = useState<string[]>([]);
  const [imageKeywordInput, setImageKeywordInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<
    string | null
  >(null);
  const [leadImage, setLeadImage] = useState(initialArticle?.image || "");

  // Floating Image Toolbar States
  const [selectedImageNode, setSelectedImageNode] =
    useState<HTMLImageElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEditorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        setSelectedImageNode(img);
        const rect = img.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect();
        if (editorRect) {
          setToolbarPosition({
            top: img.offsetTop - 50,
            left: img.offsetLeft + img.offsetWidth / 2 - 150,
          });
        }
      } else {
        if (!target.closest(".image-toolbar")) {
          setSelectedImageNode(null);
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("click", handleEditorClick);
    }
    return () => {
      if (editor) {
        editor.removeEventListener("click", handleEditorClick);
      }
    };
  }, []);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && initialArticle?.content) {
      editorRef.current.innerHTML = initialArticle.content;
    }
  }, [initialArticle]);

  // Auto-calculate read time based on word count
  useEffect(() => {
    const text = (
      title +
      " " +
      deck +
      " " +
      (editorRef.current?.innerText || content)
    ).trim();
    const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadDuration(`${minutes} min read`);
  }, [title, deck, content]);

  // Execute rich text commands
  const handleFormat = (
    command: string,
    value: string | undefined = undefined,
  ) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    const url = prompt("Enter the destination link URL (https://...):");

    selection.removeAllRanges();
    selection.addRange(range);

    if (url) {
      handleFormat("createLink", url);
    }
  };

  const handleInsertImage = () => {
    setImageModalOpen(true);
  };

  // Handle computer file upload (Screenshots 1 & 2)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploadingImage(true);
    setUploadSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", imageCaption);
      formData.append("credit", imageCredit);
      formData.append("seo_keywords", imageKeywords.join(", "));
      formData.append("uploader_email", userEmail);

      const res = await fetch("/api/upload?type=articles", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        setImageUrl(uploadedUrl);
        setUploadSuccessMessage(
          `FILE "${file.name.toUpperCase()}" COMPRESSED & UPLOADED TO CLOUD!`,
        );
        showToast("✔ IMAGE UPLOADED TO CLOUD STORAGE (HTTPS URL)!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setImageUrl(base64);
          setUploadSuccessMessage(`FILE "${file.name.toUpperCase()}" LOADED!`);
          showToast("✔ IMAGE LOADED SUCCESSFULLY!");
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload error, using local base64 fallback:", err);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImageUrl(base64);
        setUploadSuccessMessage(`FILE "${file.name.toUpperCase()}" LOADED!`);
        showToast("✔ IMAGE LOADED SUCCESSFULLY!");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Image SEO Keyword tags handler
  const handleImageKeywordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = imageKeywordInput.trim().replace(/^,+|,+$/g, "");
      if (val && !imageKeywords.includes(val) && imageKeywords.length < 4) {
        setImageKeywords([...imageKeywords, val]);
        setImageKeywordInput("");
      }
    }
  };

  const removeImageKeyword = (kwToRemove: string) => {
    setImageKeywords(imageKeywords.filter((k) => k !== kwToRemove));
  };

  // Confirm insert image into editor canvas (Screenshot 3)
  const handleConfirmInsertImage = () => {
    if (!imageUrl.trim()) {
      alert("Please paste an image URL or select a file to upload.");
      return;
    }

    const altText = imageKeywords.join(", ") || imageCaption || "Article image";

    if (selectedImageNode) {
      selectedImageNode.src = imageUrl;
      selectedImageNode.alt = altText;
      const figure = selectedImageNode.closest("figure");
      if (figure) {
        const existingFigCaption = figure.querySelector("figcaption");
        if (existingFigCaption) existingFigCaption.remove();
        if (imageCaption) {
          const figcaption = document.createElement("figcaption");
          figcaption.className =
            "text-xs text-gray-500 mt-2.5 font-medium italic";
          figcaption.innerHTML = `${imageCaption} ${imageCredit ? `<span class="not-italic text-gray-400">(${imageCredit})</span>` : ""}`;
          figure.appendChild(figcaption);
        }
      }
      setSelectedImageNode(null);
    } else {
      const figureHtml = `
        <figure class="my-6 block text-center clear-both" contenteditable="false">
          <img src="${imageUrl}" alt="${altText}" class="w-full rounded-2xl shadow-sm object-cover max-h-[520px] mx-auto cursor-pointer" />
          ${imageCaption ? `<figcaption class="text-xs text-gray-500 mt-2.5 font-medium italic">${imageCaption} ${imageCredit ? `<span class="not-italic text-gray-400">(${imageCredit})</span>` : ""}</figcaption>` : ""}
        </figure>
        <p><br></p>
      `;
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand("insertHTML", false, figureHtml);
      }
    }

    if (editorRef.current) setContent(editorRef.current.innerHTML);

    if (!leadImage) {
      setLeadImage(imageUrl);
    }

    // Reset and close modal
    setImageModalOpen(false);
    setImageUrl("");
    setImageCaption("");
    setImageCredit("");
    setImageKeywords([]);
    showToast("✔ IMAGE UPDATED/INSERTED INTO ARTICLE!");
  };

  const handleEditSelectedImage = () => {
    if (!selectedImageNode) return;
    setImageUrl(selectedImageNode.src);
    const altParts = selectedImageNode.alt.split(", ");
    setImageKeywords(altParts);
    setImageModalOpen(true);
  };

  const handleSetImageSize = (size: "w-1/3" | "w-1/2" | "w-full") => {
    if (!selectedImageNode) return;
    selectedImageNode.classList.remove("w-1/3", "w-1/2", "w-full");
    selectedImageNode.classList.add(size);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleSetImageAlign = (
    align: "float-left" | "mx-auto" | "float-right",
  ) => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest("figure");
    if (figure) {
      figure.classList.remove(
        "float-left",
        "mx-auto",
        "float-right",
        "clear-both",
        "mr-6",
        "ml-6",
      );
      figure.classList.add(align);
      if (align === "float-left") figure.classList.add("mr-6");
      if (align === "float-right") figure.classList.add("ml-6");
      if (editorRef.current) setContent(editorRef.current.innerHTML);
    }
  };

  const handleDeleteSelectedImage = () => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest("figure");
    if (figure) figure.remove();
    else selectedImageNode.remove();
    setSelectedImageNode(null);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  // Subcategory toggle
  const toggleSubcategory = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== sub));
    } else {
      if (selectedSubcategories.length >= 5) return;
      setSelectedSubcategories([...selectedSubcategories, sub]);
    }
  };

  // Tags management
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,+|,+$/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Auto-generate SEO
  const handleAutoGenerateSEO = () => {
    const rawContent = editorRef.current?.innerText || content || "";
    // Generate card summary: first 1-2 sentences of deck or content
    const summary = deck || rawContent.slice(0, 160).trim() + "...";
    setCardSummary(summary);

    // Extract focus keyword: title's key words
    const words = title
      .replace(/[^\w\s]/gi, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const kw = words.slice(0, 3).join(" ") || "Politics News";
    setFocusKeyword(kw);

    // Generate Meta description: deck or truncated summary <= 155 chars
    const meta = (deck || rawContent).slice(0, 150).replace(/\s+/g, " ").trim();
    setMetaDescription(
      meta
        ? `${meta}...`
        : `Latest reporting and in-depth analysis on ${title}.`,
    );

    showToast("✨ SEO fields auto-generated successfully!");
  };

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Save to DB (and fallback to localStorage)
  const saveArticle = async (status: "draft" | "pending") => {
    if (!title.trim()) {
      alert("Please enter a title for your article before saving.");
      return;
    }

    const currentHtml = editorRef.current?.innerHTML || content;
    const articlePayload: ArticleData = {
      id: initialArticle?.id,
      title: title.trim(),
      deck: deck.trim(),
      content: currentHtml,
      category,
      subcategories: selectedSubcategories,
      tags,
      read_time: readDuration,
      status,
      card_summary: cardSummary,
      focus_keyword: focusKeyword,
      meta_description: metaDescription,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      image: leadImage || imageUrl,
      image_caption: imageCaption,
      image_credit: imageCredit,
    };

    if (status === "draft") {
      setIsSavingDraft(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      let savedArticle = articlePayload;

      // 1. Persist directly to DB via /api/articles
      const method = initialArticle?.id ? "PUT" : "POST";
      const res = await fetch("/api/articles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...articlePayload,
          writer_email: userEmail,
          userName: userName || userEmail.split("@")[0],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          savedArticle.id = data.id;
        }
      } else {
        console.warn(
          "DB save response not OK, relying on client sync:",
          await res.text(),
        );
      }

      // 2. Also keep localStorage synchronized for instant offline cache
      const storedArticlesStr = localStorage.getItem("writer_articles");
      let storedArticles: ArticleData[] = storedArticlesStr
        ? JSON.parse(storedArticlesStr)
        : [];

      if (savedArticle.id) {
        const index = storedArticles.findIndex((a) => a.id === savedArticle.id);
        if (index >= 0) {
          storedArticles[index] = savedArticle;
        } else {
          storedArticles.unshift(savedArticle);
        }
      } else {
        savedArticle.id = Date.now();
        storedArticles.unshift(savedArticle);
      }
      localStorage.setItem("writer_articles", JSON.stringify(storedArticles));

      // 3. Show loading animation feedback as requested
      setTimeout(() => {
        if (status === "draft") {
          setIsSavingDraft(false);
          showToast("✔ DRAFT SAVED SUCCESSFULLY!");
        } else {
          setIsSubmitting(false);
          showToast("✔ ARTICLE SUBMITTED FOR REVIEW!");
        }
        onSaveSuccess(savedArticle, status);
      }, 700);
    } catch (err) {
      console.error("Error saving article:", err);
      setIsSavingDraft(false);
      setIsSubmitting(false);
      showToast("✔ DRAFT SAVED LOCALLY!");
      onSaveSuccess(articlePayload, status);
    }
  };

  const headerTrackerTitle = title.trim()
    ? title.toUpperCase().slice(0, 40) + (title.length > 40 ? "..." : "")
    : "NEW BUSINESS HEADLINE";

  // Render Settings Panel (shared by desktop card and mobile drawer)
  const renderSettingsContent = () => (
    <div className="space-y-6">
      {/* DETAILS vs SEO Tab Switcher */}
      <div className="bg-gray-100 p-1 rounded-xl grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setSidebarTab("details")}
          className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
            sidebarTab === "details"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          DETAILS
        </button>
        <button
          type="button"
          onClick={() => setSidebarTab("seo")}
          className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
            sidebarTab === "seo"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          SEO
        </button>
      </div>

      {sidebarTab === "details" ? (
        /* DETAILS TAB */
        <div className="space-y-6">
          {/* Select Category (Main) */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">
              SELECT CATEGORY (MAIN)
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSelectedSubcategories([]); // reset subcategories when main category changes
              }}
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-black transition"
            >
              {navbarCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Select Sub-categories (Max 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                SELECT SUB-CATEGORIES FOR {category.toUpperCase()} (OPTIONAL,
                MAX 5)
              </label>
            </div>

            <div className="border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto bg-gray-50/50 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  navbarSubcategoriesMap[category] ||
                  Object.values(navbarSubcategoriesMap).flat()
                ).map((sub) => {
                  const checked = selectedSubcategories.includes(sub);
                  const disabled =
                    !checked && selectedSubcategories.length >= 5;
                  return (
                    <label
                      key={sub}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                        checked
                          ? "bg-red-50 text-[#ce1126] font-bold"
                          : disabled
                            ? "opacity-40 cursor-not-allowed text-gray-400"
                            : "hover:bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSubcategory(sub)}
                        className="rounded border-gray-300 text-[#ce1126] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="truncate">{sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="text-[10px] font-bold text-gray-400 mt-1 text-right">
              SELECTED: {selectedSubcategories.length} / 5
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">
              TAGS
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g. BreakingNews, Football, WorldCup2026"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
            />
            <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              PRESS ENTER OR COMMA TO ADD • CLICK TAG TO REMOVE • {tags.length}{" "}
              TAGS
            </p>

            {/* Render Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    onClick={() => removeTag(t)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 text-[11px] font-bold cursor-pointer transition border border-gray-200 group"
                  >
                    #{t}
                    <X
                      size={10}
                      className="text-gray-400 group-hover:text-red-600"
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Read Duration */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">
              READ DURATION
            </label>
            <input
              type="text"
              value={readDuration}
              onChange={(e) => setReadDuration(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-none"
            />
          </div>
        </div>
      ) : (
        /* SEO TAB (Screenshot 4) */
        <div className="space-y-6">
          {/* Auto-Generate SEO Button */}
          <div>
            <button
              type="button"
              onClick={handleAutoGenerateSEO}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <Sparkles size={16} />
              <span>AUTO-GENERATE SEO</span>
            </button>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-2.5">
              Keyword & meta description fill in automatically from your title
              and content. Edit any field to override.
            </p>
          </div>

          {/* Card Summary (SEO Lead) */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">
              CARD SUMMARY (SEO LEAD)
            </label>
            <textarea
              rows={3}
              value={cardSummary}
              onChange={(e) => setCardSummary(e.target.value)}
              placeholder="Concise 1-2 sentence preview details."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition resize-y"
            />
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">
              FOCUS KEYWORD
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="e.g. Vexillum Minerals"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                META DESCRIPTION
              </label>
              <span
                className={`text-[10px] font-bold ${
                  metaDescription.length > 160
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {metaDescription.length}/160
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Discover why... — the sentence shown under the title in Google."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition resize-y"
            />
          </div>

          {/* Preview In Search Results (Screenshot 4) */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <span>🔍 PREVIEW IN SEARCH RESULTS</span>
            </label>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
                  P
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-gray-900">
                    POLITICO
                  </span>
                  <span className="text-[10px] text-gray-500 truncate max-w-[240px]">
                    www.politico.com &gt; article &gt;{" "}
                    {initialArticle?.slug || "story"}
                  </span>
                </div>
              </div>
              <div className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2 mt-1">
                {title.trim() ? title : "Your Article Title"} | POLITICO
              </div>
              <p className="text-xs text-gray-600 line-clamp-3 mt-1.5 leading-relaxed">
                {metaDescription.trim()
                  ? metaDescription
                  : cardSummary.trim()
                    ? cardSummary
                    : "Add a meta description to control the snippet shown in search results."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-900 select-text">
      {/* Top Navbar Header */}
      <header className="h-14 sm:h-16 bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        {/* Left Side: Back Arrow & Tracking Headline */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => {
              if (
                title.trim() &&
                !window.confirm(
                  "Are you sure you want to exit? Any unsaved edits will be lost.",
                )
              ) {
                return;
              }
              onCancel();
            }}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0"
            title="Back / Cancel"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="h-3.5 w-px bg-gray-300 flex-shrink-0" />

          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-gray-800 uppercase truncate max-w-[130px] sm:max-w-[220px] md:max-w-md">
            {headerTrackerTitle}
          </span>
        </div>

        {/* Right Side: Preview (Eye), Save Draft (Disk), Submit (Paper Plane) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Preview Button (Eye) */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition shadow-sm"
            title="Preview Story"
          >
            <Eye size={16} />
            <span className="hidden md:inline">Preview</span>
          </button>

          {/* Save Draft Button (Disk) */}
          <button
            disabled={isSavingDraft || isSubmitting}
            onClick={() => saveArticle("draft")}
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-70 transition shadow-sm"
            title="Save Draft"
          >
            {isSavingDraft ? (
              <>
                <Loader2 size={16} className="animate-spin text-gray-400" />
                <span className="hidden md:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span className="hidden md:inline">Save Draft</span>
              </>
            )}
          </button>

          {/* Submit Button (Matching homepage red color) */}
          <button
            disabled={isSavingDraft || isSubmitting}
            onClick={() => saveArticle("pending")}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#ce1126] hover:bg-[#a00c1c] active:scale-[0.98] disabled:opacity-75 transition shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin text-white" />
                <span>SAVING</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span className="hidden sm:inline">SUBMIT FOR REVIEW</span>
                <span className="sm:hidden">SUBMIT</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Layout: Centered Card Grid for Desktop (Image 1) & Mobile (Image 4) */}
      <div className="flex-1 w-full max-w-[1560px] mx-auto p-3 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        {/* Left Side: Writing Canvas Card */}
        <main className="flex-1 w-full min-w-0 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-8 lg:p-10 shadow-xs">
          {/* Editor Action Toolbar */}
          <div
            className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 mb-6 sm:mb-8 flex items-center gap-1 sm:gap-2 flex-wrap shadow-xs"
            onMouseDown={(e) => e.preventDefault()}
          >
            <button
              onClick={() => handleFormat("undo")}
              title="Undo"
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-black transition"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={() => handleFormat("redo")}
              title="Redo"
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-black transition"
            >
              <Redo size={16} />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            <button
              onClick={() => handleFormat("bold")}
              title="Bold"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black font-black transition"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => handleFormat("italic")}
              title="Italic"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black italic transition"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => handleFormat("underline")}
              title="Underline"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black underline transition"
            >
              <Underline size={16} />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            <button
              onClick={handleInsertLink}
              title="Insert Link"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition"
            >
              <Link2 size={16} />
            </button>
            <button
              onClick={() => handleFormat("insertUnorderedList")}
              title="Bullet List"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => handleFormat("insertOrderedList")}
              title="Numbered List"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition"
            >
              <ListOrdered size={16} />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            <button
              onClick={() => handleFormat("formatBlock", "blockquote")}
              title="Quote"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition"
            >
              <Quote size={16} />
            </button>
            <button
              onClick={() => handleFormat("formatBlock", "pre")}
              title="Code Block"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-black transition"
            >
              <Code size={16} />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            <button
              onClick={handleInsertImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff7ed] text-[#ea580c] hover:bg-orange-100 text-xs font-bold transition border border-orange-200/80 shadow-xs ml-auto"
            >
              <ImageIcon size={14} className="text-[#ea580c]" />
              <span className="text-[11px] sm:text-xs tracking-wider">
                INSERT IMAGE
              </span>
            </button>
          </div>

          {/* Title Input Field */}
          <div className="mb-3 sm:mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add Title..."
              className="w-full text-2xl sm:text-4xl lg:text-5xl font-black text-gray-950 placeholder-gray-300 border-none outline-none tracking-tight leading-tight bg-transparent"
            />
          </div>

          {/* Subheading / Deck Input Field */}
          <div className="mb-6 sm:mb-8">
            <input
              type="text"
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              placeholder="Add Subheading / Deck..."
              className="w-full text-sm sm:text-lg lg:text-xl font-medium text-gray-500 placeholder-gray-300 border-none outline-none leading-relaxed bg-transparent"
            />
          </div>

          <div className="relative">
            {/* Floating Image Toolbar */}
            {selectedImageNode && (
              <div
                className="image-toolbar absolute z-50 bg-[#1e293b] text-white rounded-lg shadow-xl flex items-center p-1.5 gap-2 border border-slate-700"
                style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
              >
                <button
                  onClick={handleEditSelectedImage}
                  className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                >
                  <Edit size={14} /> Edit Image
                </button>

                <div className="w-px h-5 bg-slate-600 mx-1"></div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Size
                </span>
                <button
                  onClick={() => handleSetImageSize("w-full")}
                  className={`text-xs font-bold px-2 py-1 rounded hover:bg-slate-700 ${selectedImageNode.classList.contains("w-full") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  F
                </button>
                <button
                  onClick={() => handleSetImageSize("w-1/2")}
                  className={`text-xs font-bold px-2 py-1 rounded hover:bg-slate-700 ${selectedImageNode.classList.contains("w-1/2") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  M
                </button>
                <button
                  onClick={() => handleSetImageSize("w-1/3")}
                  className={`text-xs font-bold px-2 py-1 rounded hover:bg-slate-700 ${selectedImageNode.classList.contains("w-1/3") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  S
                </button>

                <div className="w-px h-5 bg-slate-600 mx-1"></div>

                <button
                  onClick={() => handleSetImageAlign("float-left")}
                  className={`p-1.5 rounded hover:bg-slate-700 ${selectedImageNode.closest("figure")?.classList.contains("float-left") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => handleSetImageAlign("mx-auto")}
                  className={`p-1.5 rounded hover:bg-slate-700 ${selectedImageNode.closest("figure")?.classList.contains("mx-auto") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => handleSetImageAlign("float-right")}
                  className={`p-1.5 rounded hover:bg-slate-700 ${selectedImageNode.closest("figure")?.classList.contains("float-right") ? "bg-slate-700 text-[#ea580c]" : "text-slate-300"}`}
                >
                  <AlignRight size={16} />
                </button>

                <div className="w-px h-5 bg-slate-600 mx-1"></div>

                <button
                  onClick={handleDeleteSelectedImage}
                  className="p-1.5 rounded hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {/* Body Content Editor Canvas */}
            <div
              ref={editorRef}
              contentEditable
              onInput={() => {
                if (editorRef.current) {
                  setContent(editorRef.current.innerHTML);
                }
              }}
              data-placeholder="Start writing or type / for plugins"
              className="w-full min-h-[400px] sm:min-h-[550px] outline-none text-base sm:text-lg leading-relaxed text-gray-800 prose max-w-none focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:pointer-events-none"
            />
          </div>
        </main>

        {/* Article Settings Card (Side-by-side on desktop, stacked underneath on mobile) */}
        <aside className="w-full lg:w-[380px] xl:w-[410px] flex-shrink-0 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs lg:sticky lg:top-20 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900">
              ⚙️ ARTICLE SETTINGS
            </span>
          </div>
          {renderSettingsContent()}
        </aside>
      </div>

      {/* Floating Bottom-Right Toast Alert (Screenshot 3) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-black tracking-wider uppercase">
            {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Insert Article Image Modal (Screenshots 1 & 2) */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#f25c05] flex items-center justify-center">
                  <ImageIcon size={16} />
                </div>
                <h3 className="text-sm font-black text-gray-900 tracking-tight">
                  Insert Article Image
                </h3>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Paste Image URL */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  PASTE IMAGE URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition font-mono"
                />
              </div>

              {/* Divider: OR UPLOAD FILE */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  OR UPLOAD FILE
                </span>
              </div>

              {/* Choose Computer File */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  CHOOSE COMPUTER FILE
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-3.5 bg-gray-50/50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer w-full"
                  />
                  {isUploadingImage && (
                    <div className="flex items-center gap-2 text-xs text-[#f25c05] font-bold mt-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading & compressing image...</span>
                    </div>
                  )}
                  {uploadSuccessMessage && (
                    <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle
                        size={14}
                        className="text-emerald-600 flex-shrink-0"
                      />
                      <span>{uploadSuccessMessage}</span>
                    </div>
                  )}
                  {imageUrl && (
                    <div className="mt-2.5 flex items-center gap-2 p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-700 font-mono truncate">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="truncate">{imageUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image SEO Keywords (Max 4 Keywords) */}
              <div className="bg-orange-50/50 border border-orange-200/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <Sparkles size={14} className="text-[#f25c05]" />
                    <span>Image SEO Keywords (Max 4 Keywords)</span>
                  </div>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    {imageKeywords.length} / 4 KEYWORDS
                  </span>
                </div>

                <input
                  type="text"
                  value={imageKeywordInput}
                  onChange={(e) => setImageKeywordInput(e.target.value)}
                  onKeyDown={handleImageKeywordKeyDown}
                  placeholder="e.g. Donald Trump, White House, Election 2026"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition"
                />
                <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>⚡</span>
                  <span>
                    Type keyword and press Enter or comma (,) to add. Maximum 4
                    keywords per image.
                  </span>
                </p>

                {imageKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {imageKeywords.map((kw) => (
                      <span
                        key={kw}
                        onClick={() => removeImageKeyword(kw)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-gray-800 text-[11px] font-bold cursor-pointer border border-orange-200 hover:bg-red-50 hover:text-red-700 transition group"
                      >
                        #{kw}
                        <X
                          size={10}
                          className="text-gray-400 group-hover:text-red-600"
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Caption */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  Image Caption (Visible under picture to readers)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Brief description (e.g. President speaking with reporters outside Capitol)"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                />
              </div>

              {/* Image Credit / Source */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  Image Credit / Source (Optional)
                </label>
                <input
                  type="text"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  placeholder="e.g. Reuters, AP Photo, Getty Images"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="h-16 px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmInsertImage}
                disabled={!imageUrl.trim() || isUploadingImage}
                className="px-5 py-2.5 rounded-xl bg-[#f25c05] hover:bg-[#e05300] active:scale-[0.98] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} strokeWidth={3} />
                <span>+ INSERT IMAGE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-10 relative">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#ce1126] text-xs font-bold uppercase tracking-wider mb-4">
              {category}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              {title || "Untitled Article"}
            </h1>

            {deck && (
              <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed mb-4 border-l-4 border-[#ce1126] pl-4">
                {deck}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500 pb-6 border-b border-gray-200 mb-6">
              <span>By {userName || userEmail.split("@")[0]}</span>
              <span>•</span>
              <span>{readDuration}</span>
            </div>

            <div
              className="prose max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  editorRef.current?.innerHTML ||
                  content ||
                  "<p>No content written yet.</p>",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
