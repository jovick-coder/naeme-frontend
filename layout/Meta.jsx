import Head from "next/head";

export const Meta = ({ title, content, children, className }) => {
  return (
    <div className={className}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={content} />
      </Head>
      <div className="max-w-screen-xl mx-auto">{children}</div>
    </div>
  );
};
