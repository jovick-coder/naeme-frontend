import Head from "next/head";
import Nav from "./Nav";

export const Meta = ({ title, content, children, className }) => {
  return (
    <div className={`${className}`}>
      <main className="max-w-screen-2xl mx-auto">
        <Nav />
        <Head>
          <title>{title}</title>
          <meta name="description" content={content} />
        </Head>
        {children}
      </main>
    </div>
  );
};
