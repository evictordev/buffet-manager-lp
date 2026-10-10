import { useRef, type CSSProperties } from 'react'
import type { FeatureGroup } from '../data/content'
import { gsap } from '../lib/gsap'
import { TILE } from '../lib/tones'
import { useGsapScope } from '../hooks/useGsapScope'
import { MediaCarousel, VideoSlide } from './ui/MediaCarousel'
import { ScreenshotFrame } from './ui/ScreenshotFrame'

type Props = { group: FeatureGroup; reverse?: boolean }

/** Bloco de uma categoria de funcionalidades: texto, recursos e capturas de tela correspondentes. */
export function FeatureShowcase({ group, reverse = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { id, eyebrow, title, description, items, shot, secondaryShot, gallery, video, highlight, tone } = group

  useGsapScope(ref, {
    full: (root) => {
      // Parallax leve: captura principal sobe e a secundária desce, criando profundidade
      const main = root.querySelector('[data-parallax]')
      const second = root.querySelector('[data-parallax-alt]')
      const trigger = { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      if (main) gsap.fromTo(main, { yPercent: 3 }, { yPercent: -3, ease: 'none', scrollTrigger: trigger })
      if (second) gsap.fromTo(second, { yPercent: -4 }, { yPercent: 6, ease: 'none', scrollTrigger: trigger })
    },
  })

  const itemList =
    items.length > 0 ? (
      <ul data-stagger className={`mt-8 grid gap-3 ${highlight || !shot ? 'sm:grid-cols-2' : ''}`}>
        {items.map(({ icon: Icon, title: itemTitle, text }) => (
          <li
            key={itemTitle}
            data-stagger-item
            className="flex gap-3.5 rounded-xl border border-ink-600 bg-ink-800 p-4 transition-colors hover:border-violet-400/50"
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white ${TILE[tone]}`}
              aria-hidden="true"
            >
              <Icon className="size-[18px]" />
            </span>
            <span>
              <span className="block font-semibold text-white">{itemTitle}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-mist-400">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    ) : null

  const textCol = (
    <div data-carousel-item style={{ '--i': 0 } as CSSProperties}>
      <div data-reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">{eyebrow}</p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight text-balance sm:text-3xl lg:text-[2rem]">{title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-mist-400">{description}</p>
      </div>
      {itemList}
    </div>
  )

  const visualCol = shot ? (
    <div data-reveal={reverse ? 'left' : 'right'} className={secondaryShot ? 'pb-14 sm:pb-24' : ''}>
      <div className="relative">
        <div data-carousel-item style={{ '--i': 1 } as CSSProperties} className={secondaryShot ? 'w-[88%]' : ''}>
          <div data-parallax>
            <ScreenshotFrame variant="browser" name={shot.name} alt={shot.alt} label={shot.label} />
          </div>
        </div>
        {secondaryShot ? (
          <div
            data-carousel-item
            style={{ '--i': 2 } as CSSProperties}
            className="absolute -bottom-14 right-0 w-[62%] sm:-bottom-24"
          >
            <div data-parallax-alt>
              <ScreenshotFrame
                variant="browser"
                name={secondaryShot.name}
                alt={secondaryShot.alt}
                label={secondaryShot.label}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null

  const content = (
    <div
      className={
        highlight
          ? 'rounded-[2rem] border border-ink-500 bg-gradient-to-b from-ink-800 to-ink-900 p-6 sm:p-10 lg:p-14'
          : !shot
            ? 'rounded-[2rem] border border-ink-600 bg-ink-800/60 p-6 sm:p-10 lg:p-14'
            : ''
      }
    >
      {shot ? (
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {reverse ? (
            <>
              {visualCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {visualCol}
            </>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">{textCol}</div>
      )}

      {gallery && gallery.length > 0 ? (
        <div className="mt-14 border-t border-ink-600 pt-10">
          <ul data-stagger className="grid gap-8 md:grid-cols-3">
            {gallery.map((g) => (
              <li key={g.name} data-stagger-item>
                <ScreenshotFrame variant="browser" name={g.name} alt={g.alt} label={g.label} />
                <p className="mt-4 text-center font-medium text-white">{g.label}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )

  return (
    <article id={id} ref={ref} data-reveal-scope aria-labelledby={`${id}-title`}>
      <span id={`${id}-title`} className="sr-only">
        {eyebrow}: {title}
      </span>

      {video ? (
        <MediaCarousel
          ariaLabel={`${eyebrow}: texto e vídeo`}
          slides={[
            { label: eyebrow, render: () => content },
            {
              label: video.label,
              render: (active) => (
                <VideoSlide src={`${import.meta.env.BASE_URL}${video.src}`} alt={video.alt} active={active} />
              ),
            },
          ]}
        />
      ) : (
        content
      )}
    </article>
  )
}
