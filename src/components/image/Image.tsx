import NextImage, { ImageProps as OImageProps } from "next/image";

const shimmer = (w:number, h:number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" opacity="0.5">
  <defs>
    <linearGradient id="g-image-shimmer">
      <stop stop-color="#ccc" offset="20%" />
      <stop stop-color="#eee" offset="50%" />
      <stop stop-color="#ccc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g-image-shimmer)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
const toBase64 = (str: string) => {
  try {
    return btoa(str);
  } catch (err) {
    console.error('Failed to convert to Base64:', err);
    return null;
  }
}
const makeBlurDataURL = (width: number, height: number) => {
  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
}

export type ImageProps =  {
  alt?: string;
  className?: any;
  imageProps?: any;
  skeleton?: boolean;
} & Omit<OImageProps, 'alt'>;

export const Image = ({
  width,
  height,
  src,
  alt="",
  className,
  skeleton = false,
  unoptimized = true,
  ...imageProps
}: ImageProps) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={unoptimized}
      {...(skeleton
        ? {
            placeholder: "blur",
            blurDataURL: makeBlurDataURL(width as number, height as number),
          }
        : {})}
      className={className}
      {...imageProps}
    />
  );
};


// Image.displayName = "Image";
