import { useRouter } from 'next/router';
import { BuilderComponent, Builder, builder } from '@builder.io/react';
import DefaultErrorPage from 'next/error';


// Initialize builder with your apiKey
builder.init('3894404412c344b3b78e13fea52cd201');

export async function getStaticProps({ params }) {
  if(params?.page){
      const page = await builder
      .get('page', {
        userAttributes: {
          urlPath: '/' + (params?.page?.join('/') || ''),
        },
      })
      .toPromise();
    return {
      props: {
        page: page || null,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10,
    };
  }
}
export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true },
    omit: 'data.blocks',
  });
  return {
    paths: pages.map(page => `${page.data?.url}`),
    fallback: true,
  };
}
export default function Page({ page }) {
  const router = useRouter();
  if (router.isFallback) {
    return (
    <div class="bulider_loading">
      Loading...
    </div>
    );
  }
  
  
  const isLive = !Builder.isEditing && !Builder.isPreviewing;
  if (!page && isLive && router?.asPath != "/") {
    return (
        <DefaultErrorPage statusCode={404} />
    );
  }
  return (
    <BuilderComponent model="page" content={page} />
  );
}