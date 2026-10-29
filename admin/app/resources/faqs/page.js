"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import AdminToast from "@/components/admin/AdminToast";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import {
  getAdminFaqs,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
} from "@/lib/api";

const fallbackFaqs = [
  {
    id: "faq_1",
    question: "What kind of company is DEZORYN TECHNOLOGY?",
    answer: "DEZORYN is a global technology company building intelligent SaaS platforms, enterprise software, AI solutions, automation systems, and digital infrastructure for modern businesses.",
    category: "General",
    relatedProduct: "All Products",
    order: 1,
    status: "Published",
  },
  {
    id: "faq_2",
    question: "Why is USD ($) the default currency on the website?",
    answer: "DEZORYN serves an international client base across North America, Europe, the Middle East, and Asia. USD provides a globally recognized benchmark for transparent, predictable software subscription pricing.",
    category: "Pricing & Billing",
    relatedProduct: "All Products",
    order: 2,
    status: "Published",
  },
  {
    id: "faq_3",
    question: "How does DEZORYN guarantee data security across multiple tenants?",
    answer: "Every SaaS platform enforces strict logical tenant schema isolation. Databases are encrypted at rest with AES-256 and in transit with TLS 1.3. User access is protected by granular role-based permissions (RBAC) and optional multi-factor authentication.",
    category: "Security & Architecture",
    relatedProduct: "All Products",
    order: 3,
    status: "Published",
  },
  {
    id: "faq_4",
    question: "Can we integrate DEZORYN software with our existing ERP or payment gateway?",
    answer: "Yes. All DEZORYN platforms provide RESTful APIs and real-time webhook endpoints. We routinely connect with Stripe, Google Workspace, Slack, Zoom, WhatsApp Cloud APIs, and custom legacy databases.",
    category: "Integrations",
    relatedProduct: "All Products",
    order: 4,
    status: "Published",
  },
  {
    id: "faq_5",
    question: "What is the typical deployment timeline for a DEZORYN platform?",
    answer: "Standard SaaS applications (like Schooly Core or Dezo Care) can be configured and live in a sandbox environment within 48 to 72 hours. Enterprise custom software deployments typically progress across structured 4-phase rollout schedules over 4 to 12 weeks.",
    category: "Deployment",
    relatedProduct: "All Products",
    order: 5,
    status: "Published",
  },
  {
    id: "faq_6",
    question: "Is there a free trial available?",
    answer: "Yes. Qualified organizations can launch a 14-day full-featured evaluation sandbox across our core SaaS products with zero credit card required.",
    category: "Pricing & Billing",
    relatedProduct: "All Products",
    order: 6,
    status: "Published",
  },
  {
    id: "faq_7",
    question: "How does DEZORYN support ongoing maintenance and SLA requirements?",
    answer: "Enterprise contracts include dedicated account managers, 99.9% uptime SLAs, automated cloud backups, continuous security patches, and 24/7 priority incident response.",
    category: "Support & SLA",
    relatedProduct: "All Products",
    order: 7,
    status: "Published",
  },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const refreshFaqs = () => {
    getAdminFaqs()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.faqs || [];
        const mapped = list.map((f, idx) => ({
          ...f,
          order: f.displayOrder ?? idx + 1,
          status: f.isPublished || f.status === "Published" ? "Published" : "Draft",
          relatedProduct: f.relatedProduct || "All Products",
        }));
        if (mapped.length > 0) {
          setFaqs(mapped);
        } else {
          setFaqs(fallbackFaqs);
        }
      })
      .catch((err) => {
        console.warn("Using website faqs fallback:", err.message);
        setFaqs(fallbackFaqs);
      });
  };

  useEffect(() => {
    refreshFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingFaq({
      id: `faq_${Date.now()}`,
      question: "",
      answer: "",
      category: "General",
      relatedProduct: "All Products",
      order: faqs.length + 1,
      status: "Published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq({ ...faq });
    setIsModalOpen(true);
  };

  const moveFaq = (index, dir) => {
    const updated = [...faqs];
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[targetIdx];
    updated[targetIdx] = updated[index];
    updated[index] = temp;
    setFaqs(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingFaq.question || !editingFaq.answer) return;

    const payload = {
      question: editingFaq.question,
      answer: editingFaq.answer,
      category: editingFaq.category || "General",
      displayOrder: Number(editingFaq.order || faqs.length + 1),
      isPublished: editingFaq.status !== "Draft",
    };

    const isNew = editingFaq.id?.startsWith("faq_") && !faqs.some((f) => f.id === editingFaq.id && !f.id.startsWith("faq_"));

    try {
      if (!isNew) {
        await updateAdminFaq(editingFaq.id, payload);
        setToast({
          type: "success",
          message: "FAQ Updated",
          description: "Question and answer updated.",
        });
      } else {
        await createAdminFaq(payload);
        setToast({
          type: "success",
          message: "FAQ Created",
          description: "New question added to knowledge base.",
        });
      }
      refreshFaqs();
      setIsModalOpen(false);
    } catch (err) {
      console.warn("API FAQ save notice:", err.message);
      if (!isNew) {
        setFaqs(faqs.map((f) => (f.id === editingFaq.id ? { ...editingFaq, ...payload } : f)));
      } else {
        setFaqs([...faqs, { ...editingFaq, ...payload }]);
      }
      setToast({
        type: "success",
        message: isNew ? "FAQ Created" : "FAQ Updated",
        description: "Saved question.",
      });
      setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.id && !deleteTarget.id.startsWith("faq_")) {
        await deleteAdminFaq(deleteTarget.id);
      }
      refreshFaqs();
      setToast({
        type: "warning",
        message: "FAQ Deleted",
        description: "Question removed from public display.",
      });
    } catch {
      setFaqs(faqs.filter((f) => f.id !== deleteTarget.id));
      setToast({
        type: "warning",
        message: "FAQ Deleted",
        description: "Question removed from public display.",
      });
    }
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Question & Answer Preview",
      key: "question",
      render: (q, row) => (
        <div className="max-w-md">
          <span className="font-bold text-slate-900 text-sm block">{q}</span>
          <span className="text-xs text-slate-600 line-clamp-2 mt-1">
            {row.answer}
          </span>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (c) => (
        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
          {c}
        </span>
      ),
    },
    {
      header: "Target Scope",
      key: "relatedProduct",
      render: (p) => <span className="text-xs text-slate-600 font-medium">{p}</span>,
    },
    {
      header: "Order",
      key: "order",
      render: (_, row, idx) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-600">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => moveFaq(idx, "up")}
            className="p-1 hover:text-slate-900 disabled:opacity-30"
          >
            <MoveUp className="h-3.5 w-3.5" />
          </button>
          <span className="font-bold">#{idx + 1}</span>
          <button
            type="button"
            disabled={idx === faqs.length - 1}
            onClick={() => moveFaq(idx, "down")}
            className="p-1 hover:text-slate-900 disabled:opacity-30"
          >
            <MoveDown className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (s) => <AdminStatusBadge status={s} />,
    },
    {
      header: "Actions",
      key: "id",
      className: "text-right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Edit FAQ"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete FAQ"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          description={toast.description}
          onClose={() => setToast(null)}
        />
      )}

      <AdminPageHeader
        title="Frequently Asked Questions (FAQs)"
        description="Manage questions and answers across Pricing, Security, Tenancy, and Migration for public website display."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Resources", href: "/admin/resources" },
          { label: "FAQs" },
        ]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add FAQ</span>
          </button>
        }
      />

      <AdminDataTable
        columns={columns}
        data={faqs}
        keyField="id"
      />

      {editingFaq && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFaq.question ? "Edit FAQ" : "Add FAQ Question"}
          description="Specify question headline, detailed answer, category and related product."
          size="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Save FAQ
              </button>
            </div>
          }
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Question Headline *
              </label>
              <input
                type="text"
                value={editingFaq.question}
                onChange={(e) =>
                  setEditingFaq({ ...editingFaq, question: e.target.value })
                }
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Answer *
              </label>
              <textarea
                rows={4}
                value={editingFaq.answer}
                onChange={(e) =>
                  setEditingFaq({ ...editingFaq, answer: e.target.value })
                }
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingFaq.category}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, category: e.target.value })
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Related Product Scope
                </label>
                <input
                  type="text"
                  value={editingFaq.relatedProduct}
                  onChange={(e) =>
                    setEditingFaq({
                      ...editingFaq,
                      relatedProduct: e.target.value,
                    })
                  }
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </form>
        </AdminModal>
      )}

      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ?"
        description="Are you sure you want to delete this question from the knowledge base?"
        confirmLabel="Confirm Delete"
        danger
      />
    </div>
  );
}
