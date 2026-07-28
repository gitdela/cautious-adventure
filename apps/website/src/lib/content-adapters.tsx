import NextLink from "next/link";
import NextImage from "next/image";
import { urlForImage } from "@workspace/cms/image";
import type {
  ContentAdapters,
  ContentImageProps,
  ContentLinkProps,
} from "@workspace/content";

// Website adapters: next/link + next/image. Sanity source objects are turned
// into CDN URLs here (cdn.sanity.io is allowlisted in next.config images).
function LinkAdapter({ href, children, className }: ContentLinkProps) {
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}

function ImageAdapter({
  source,
  alt,
  width = 1200,
  height = 675,
  sizes,
  className,
  priority,
}: ContentImageProps) {
  const src = urlForImage(source)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .url();

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}

export const contentAdapters: ContentAdapters = {
  Link: LinkAdapter,
  Image: ImageAdapter,
};
