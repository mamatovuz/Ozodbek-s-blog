import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./blog.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import {
  formatDisplayDate,
  getStoredPosts,
  groupPostsByYear,
  sortPosts,
} from "../../utils/blogStore";

const BlogListView = ({ posts }) => {
  const groupedPosts = groupPostsByYear(posts);

  return (
    <>
      <section className="blog-header-band">
        <h1>BLOG</h1>
      </section>

      <section className="blog-layout">
        <div className="blog-timeline">
          {[...groupedPosts.entries()].map(([year, monthMap]) => (
            <section key={year} className="blog-year-group">
              <div className="blog-year-pill">{year}</div>

              {[...monthMap.entries()].map(([month, monthPosts]) => (
                <div key={`${year}-${month}`} className="blog-month-group">
                  <h2>{month}</h2>

                  {monthPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="blog-list-item">
                      <span>{formatDisplayDate(post.date)}</span>
                      <strong>{post.title}</strong>
                    </Link>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>

        <aside className="blog-sidebar">
          <h3>Obuna Bo'ling</h3>
          <p>
            Yangi maqola, maruza va darslarimni{" "}
            <a href="https://t.me/OzodCode" target="_blank" rel="noreferrer">
              @OzodCode
            </a>{" "}
            telegram kanalida topishingiz mumkin.
          </p>
        </aside>
      </section>
    </>
  );
};

const BlogDetailView = ({ post }) => {
  return (
    <article className="blog-detail">
      <header className="blog-detail-head">
        <h1>{post.title}</h1>
        <span>{formatDisplayDate(post.date)}</span>
        <div className="blog-detail-line"></div>
      </header>

      {post.summary ? <p className="blog-detail-summary">{post.summary}</p> : null}

      <div
        className="blog-rich-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
};

const BlogNotFound = () => (
  <section className="blog-not-found">
    <h1>Blog topilmadi</h1>
    <p>Bu sahifa mavjud emas.</p>
    <Link to="/blog">Blogga qaytish</Link>
  </section>
);

const Blog = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState(() => getStoredPosts());

  useEffect(() => {
    setPosts(getStoredPosts());
  }, [slug]);

  const sortedPosts = sortPosts(posts);
  const activePost = slug ? sortedPosts.find((post) => post.slug === slug) : null;

  return (
    <>
      <Navbar />
      <main className="blog-page">
        {slug ? (
          activePost ? (
            <BlogDetailView post={activePost} />
          ) : (
            <BlogNotFound />
          )
        ) : (
          <BlogListView posts={sortedPosts} />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Blog;
