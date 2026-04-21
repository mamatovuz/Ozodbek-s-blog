import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  buildUniqueSlug,
  fetchPosts,
  formatDisplayDate,
  getStoredPosts,
  setAuthenticated,
  sortPosts,
  stripHtml,
  syncPosts,
} from "../../utils/blogStore";

const emptyForm = {
  title: "",
  slug: "",
  contentHtml: "<p>Yangi blog matnini shu yerga yozing.</p>",
};

const createToolbarState = () => ({
  visible: false,
  x: 0,
  y: 0,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const savedRangeRef = useRef(null);
  const draggedBlockRef = useRef(null);

  const [posts, setPosts] = useState(() => getStoredPosts());
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [toolbar, setToolbar] = useState(createToolbarState);
  const [isSaving, setIsSaving] = useState(false);

  const sortedPosts = useMemo(() => sortPosts(posts), [posts]);
  const editorWordCount = useMemo(() => {
    const cleanText = stripHtml(formData.contentHtml);
    return cleanText ? cleanText.split(/\s+/).length : 0;
  }, [formData.contentHtml]);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      const nextPosts = await fetchPosts();

      if (isMounted) {
        setPosts(nextPosts);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== formData.contentHtml) {
      editorRef.current.innerHTML = formData.contentHtml;
      decorateEditorMedia(editorRef.current);
    }
  }, [formData.contentHtml]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const editor = editorRef.current;

      if (!editor) {
        return;
      }

      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        setToolbar(createToolbarState());
        return;
      }

      const range = selection.getRangeAt(0);
      const insideEditor = editor.contains(range.commonAncestorContainer);

      if (!insideEditor || selection.isCollapsed) {
        setToolbar(createToolbarState());
        return;
      }

      savedRangeRef.current = range.cloneRange();
      const rect = range.getBoundingClientRect();

      setToolbar({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 12,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const syncEditorState = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    decorateEditorMedia(editor);
    setFormData((current) => ({
      ...current,
      contentHtml: editor.innerHTML,
    }));
  };

  const handleMetaChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const restoreSelection = () => {
    const selection = window.getSelection();

    if (!selection || !savedRangeRef.current) {
      return false;
    }

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
    return true;
  };

  const applyCommand = (command, value = null) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    syncEditorState();
  };

  const handleAddLink = () => {
    const url = window.prompt("Link kiriting", "https://");

    if (!url) {
      return;
    }

    applyCommand("createLink", url);
  };

  const handleColorChange = (event) => {
    applyCommand("foreColor", event.target.value);
  };

  const placeCaretAtEnd = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangeRef.current = range.cloneRange();
  };

  const insertHtmlAtSelection = (html) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();

    if (!restoreSelection()) {
      placeCaretAtEnd();
      restoreSelection();
    }

    document.execCommand("insertHTML", false, html);
    syncEditorState();
  };

  const handleSelectImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageHtml = `
        <figure class="editor-image-block" data-image-block="true" draggable="true">
          <img src="${String(reader.result)}" alt="Blog image" />
        </figure>
        <p><br></p>
      `;
      insertHtmlAtSelection(imageHtml);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setStatusText("");
    setToolbar(createToolbarState());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanTitle = formData.title.trim();
    const cleanHtml = formData.contentHtml.trim();

    if (!cleanTitle || !stripHtml(cleanHtml)) {
      setStatusText("Title va blog matni to'ldirilishi kerak.");
      return;
    }

    const nextSlug = buildUniqueSlug(
      formData.slug.trim() || cleanTitle,
      posts,
      editingId
    );

    const existingPost = posts.find((post) => post.id === editingId);

    const nextPost = {
      id: editingId || `post-${Date.now()}`,
      slug: nextSlug,
      title: cleanTitle,
      summary: "",
      contentHtml: cleanHtml,
      date: existingPost?.date || new Date().toISOString().slice(0, 10),
    };

    const updatedPosts = editingId
      ? posts.map((post) => (post.id === editingId ? nextPost : post))
      : [nextPost, ...posts];

    setIsSaving(true);
    const syncedPosts = await syncPosts(updatedPosts);
    setPosts(sortPosts(syncedPosts));
    setIsSaving(false);
    resetForm();
    setStatusText(
      editingId
        ? "Blog yangilandi. Cloud storage ulangan bo'lsa hammaga ko'rinadi."
        : "Yangi blog saqlandi. Cloud storage ulangan bo'lsa hammaga ko'rinadi."
    );
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      contentHtml: post.contentHtml,
    });
    setStatusText("Tahrirlash rejimi yoqildi.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setIsSaving(true);
    const syncedPosts = await syncPosts(updatedPosts);
    setPosts(sortPosts(syncedPosts));
    setIsSaving(false);

    if (editingId === postId) {
      resetForm();
    }

    setStatusText("Blog o'chirildi.");
  };

  const handleLogout = () => {
    setAuthenticated(false);
    navigate("/dashboard/login", { replace: true });
  };

  const handleContextMenu = (event) => {
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      event.preventDefault();
      setToolbar({
        visible: true,
        x: event.clientX,
        y: event.clientY,
      });
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const handleDragStart = (event) => {
    const block = event.target.closest("[data-image-block='true']");

    if (!block) {
      return;
    }

    draggedBlockRef.current = block;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "image-block");
  };

  const handleDragOver = (event) => {
    if (draggedBlockRef.current) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (event) => {
    const block = draggedBlockRef.current;

    if (!block || !editorRef.current) {
      return;
    }

    event.preventDefault();
    const dropRange = getDropRange(event.clientX, event.clientY);

    if (!dropRange) {
      return;
    }

    dropRange.insertNode(block);
    syncEditorState();
    draggedBlockRef.current = null;
  };

  const handleDragEnd = () => {
    draggedBlockRef.current = null;
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div className="dashboard-header-copy">
            <span className="dashboard-kicker">Content Studio</span>
            <h1>Dashboard</h1>
            <p>Blog yozish, tartiblash va e'lon qilish uchun bir joyga yig'ilgan boshqaruv paneli.</p>
          </div>

          <div className="dashboard-sync-pill">
            <strong>{sortedPosts.length}</strong>
            <span>ta post</span>
          </div>

          <div className="dashboard-header-actions">
            <button type="button" className="dashboard-link-button" onClick={() => navigate("/blog")}>
              /blog ni ko'rish
            </button>
            <button type="button" className="dashboard-link-button" onClick={handleLogout}>
              Chiqish
            </button>
          </div>
        </header>

        <section className="dashboard-editor-card">
          <div className="dashboard-editor-top">
            <div>
              <h2>{editingId ? "Blogni tahrirlash" : "Yangi blog yaratish"}</h2>
              <p>Matnni belgilang, keyin toolbar orqali bold, link va rang bering.</p>
            </div>

            <div className="dashboard-editor-side">
              <div className="dashboard-editor-stats">
                <div>
                  <strong>{editorWordCount}</strong>
                  <span>So'z</span>
                </div>
                <div>
                  <strong>{editingId ? "Edit" : "New"}</strong>
                  <span>Holat</span>
                </div>
              </div>

              <div className="dashboard-editor-actions">
                <button type="button" className="dashboard-toolbar-button" onClick={handleSelectImage}>
                  Rasm qo'shish
                </button>
                <button type="button" className="dashboard-toolbar-button" onClick={() => applyCommand("formatBlock", "<h2>")}>
                  Sarlavha
                </button>
                <button type="button" className="dashboard-toolbar-button" onClick={() => applyCommand("removeFormat")}>
                  Tozalash
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="dashboard-meta-grid">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleMetaChange}
                  placeholder="Masalan: 20 yoshgacha 20 urinish"
                  required
                />
              </label>

              <label>
                Slug
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleMetaChange}
                  placeholder="20-yoshgacha-20-urinish"
                />
              </label>
            </div>

            <div className="dashboard-editor-wrap" onContextMenu={handleContextMenu}>
              {toolbar.visible ? (
                <div
                  className="editor-selection-toolbar"
                  style={{
                    left: `${toolbar.x}px`,
                    top: `${toolbar.y}px`,
                  }}
                >
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyCommand("bold")}>
                    Bold
                  </button>
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={handleAddLink}>
                    Link
                  </button>
                  <label onMouseDown={(event) => event.preventDefault()}>
                    Rang
                    <input type="color" defaultValue="#223045" onChange={handleColorChange} />
                  </label>
                </div>
              ) : null}

              <div
                ref={editorRef}
                className="dashboard-editor-surface"
                contentEditable
                suppressContentEditableWarning
                onInput={syncEditorState}
                onBlur={syncEditorState}
                onMouseUp={syncEditorState}
                onKeyUp={syncEditorState}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="dashboard-hidden-input"
              onChange={handleImageChange}
            />

            {statusText ? <p className="dashboard-status">{statusText}</p> : null}

            <div className="dashboard-submit-row">
              <button type="submit" className="dashboard-save-button">
                {isSaving ? "Saqlanmoqda..." : editingId ? "Yangilash" : "Blogni saqlash"}
              </button>
              <button type="button" className="dashboard-reset-button" onClick={resetForm}>
                Tozalash
              </button>
            </div>
          </form>
        </section>

        <section className="dashboard-list-card">
          <div className="dashboard-list-header">
            <div>
              <h2>Mavjud bloglar</h2>
              <p className="dashboard-list-copy">Oxirgi yozuvlar, slug va tezkor boshqaruvlar shu yerda.</p>
            </div>
            <span>{sortedPosts.length} ta post</span>
          </div>

          <div className="dashboard-post-list">
            {sortedPosts.length ? (
              sortedPosts.map((post) => (
                <article key={post.id} className="dashboard-post-row">
                  <div className="dashboard-post-row-copy">
                    <div className="dashboard-post-row-topline">
                      <span>{formatDisplayDate(post.date)}</span>
                      <small>Live</small>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{stripHtml(post.contentHtml).slice(0, 120) || "Post tayyor."}</p>
                    <code>/blog/{post.slug}</code>
                  </div>

                  <div className="dashboard-post-row-actions">
                    <button type="button" className="dashboard-inline-button" onClick={() => handleEdit(post)}>
                      Tahrirlash
                    </button>
                    <button type="button" className="dashboard-inline-button danger" onClick={() => handleDelete(post.id)}>
                      O'chirish
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="dashboard-empty-state">
                <strong>Hali post yo'q</strong>
                <p>Birinchi blogni yuqoridagi editor orqali yozishni boshlang.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

const decorateEditorMedia = (root) => {
  root.querySelectorAll("[data-image-block='true']").forEach((block) => {
    block.setAttribute("draggable", "true");
    block.classList.add("editor-image-block");
  });
};

const getDropRange = (clientX, clientY) => {
  if (document.caretRangeFromPoint) {
    return document.caretRangeFromPoint(clientX, clientY);
  }

  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(clientX, clientY);

    if (!position) {
      return null;
    }

    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);
    return range;
  }

  return null;
};

export default Dashboard;
