import Head from "next/head";
import Nav from "./Nav";

export const Meta = ({ title, content, children, className }) => {
  return (
    <div className={`${className}`}>
      <main>
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
