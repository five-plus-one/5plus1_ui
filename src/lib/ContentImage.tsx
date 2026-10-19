/** ContentImage - 从课栈 shared/ContentImage 提取
 *
 * 正文图片：加载失败时显示占位说明；有标题时包在 figure 中作为图注。
 */

import { useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

export interface ContentImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** 图注，存在时使用 figure 包裹 */
  title?: string;
}

export function ContentImage({ src, alt, title, ...rest }: ContentImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <span className="fp-content-image-error" role="img" aria-label={alt || "图片"}>
        <ImageOff size={22} aria-hidden="true" />
        <span>{alt || "图片加载失败"}</span>
      </span>
    );
  }

  const img = (
    <img
      src={src}
      alt={alt || ""}
      title={title}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      {...rest}
    />
  );

  if (title) {
    return (
      <figure className="fp-content-image">
        {img}
        <figcaption>{title}</figcaption>
      </figure>
    );
  }
  return <span className="fp-content-image-plain">{img}</span>;
}
