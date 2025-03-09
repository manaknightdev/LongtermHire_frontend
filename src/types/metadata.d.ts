interface MetadataItem {
  title: string;
  description: string;
  twitter_image?: string;
}

declare module '@/utils/metadata.json' {
  const metadata: {
    [key: string]: MetadataItem;
  };
  export default metadata;
}
