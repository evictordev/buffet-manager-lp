import { useRef, type CSSProperties } from 'react'
import type { FeatureGroup } from '../data/content'
import { ArrowRight } from 'lucide-react'
import { CONTACT_HREF } from '../config/site'
import { Button } from './ui/Button'
import { useGsapScope } from '../hooks/useGsapScope'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { AnimatedList } from './ui/AnimatedList'
import { EventFlow } from './ui/EventFlow'
import { FlowMainFrame } from './ui/FlowMainFrame'
import { MediaCarousel, VideoSlide } from './ui/MediaCarousel'
import { ScreenshotFrame } from './ui/ScreenshotFrame'

type Props = { group: FeatureGroup; reverse?: boolean }

/** Bloco de uma categoria de funcionalidades: texto, recursos e capturas de tela correspondentes. */
export function FeatureShowcase({ group, reverse = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { id, eyebrow, title, description, items, shot, secondaryShot, gallery, video, cta, flow, descriptionBelowImage, utensilList, highlight } = group

  useGsapScope(ref)

  const itemList =
    items.length > 0 ? (
      <ul data-stagger className={`mt-8 grid gap-x-8 gap-y-5 ${highlight || !shot ? 'sm:grid-cols-2' : ''}`}>
        {items.map(({ icon: Icon, title: itemTitle, text }) => (
          <li key={itemTitle} data-stagger-item className="flex items-stretch gap-4">
            <Icon
              className="size-8 shrink-0 self-center fill-brass-300/30 text-brass-300"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="flex min-w-0 flex-1 items-stretch">
              <span className="w-0.5 shrink-0 rounded-full bg-brass-300/60" aria-hidden="true" />
              <span className="min-w-0 flex-1 rounded-r-lg bg-white/[0.05] px-4 py-3">
                <span className="block text-lg font-medium text-white">{itemTitle}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-mist-400">{text}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    ) : null

  const textCol = (
    <div data-carousel-item style={{ '--i': 0 } as CSSProperties}>
      <div data-reveal>
        <h3 id={`${id}-title`} className="text-3xl font-semibold leading-tight text-balance sm:text-4xl">
          <span className="sr-only">{eyebrow}: </span>
          {title}
        </h3>
        {descriptionBelowImage && shot ? null : (
          <p className="mt-5 text-base leading-relaxed text-mist-400 sm:text-lg">{description}</p>
        )}
        {cta ? (
          <Button href={CONTACT_HREF} size="lg" className="mt-8 hover:translate-y-0!">
            {cta.label}
            <ArrowRight className="cta-arrow size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      {itemList}
    </div>
  )

  const flowCategories = flow && gallery && gallery.length > 0 ? gallery : null

  // Imagens do bloco animado: a principal primeiro, depois as da fileira de baixo
  const flowImages = flowCategories && shot ? [shot, ...flowCategories] : null
  const mainFrameRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const visualCol = shot ? (
    <div data-reveal={reverse ? 'left' : 'right'} className={secondaryShot ? 'pb-14 sm:pb-24' : ''}>
      <div className="relative">
        <div data-carousel-item style={{ '--i': 1 } as CSSProperties} className={secondaryShot ? 'w-[88%]' : ''}>
          <div>
            {utensilList ? (
              <AnimatedList items={utensilList} />
            ) : flowImages ? (
              <FlowMainFrame
                label={flowImages[0].label}
                frameRef={mainFrameRef}
                staticImage={reduced ? shot : null}
              />
            ) : (
              <ScreenshotFrame variant="browser" name={shot.name} alt={shot.alt} label={shot.label} />
            )}
          </div>
        </div>
        {secondaryShot ? (
          <div
            data-carousel-item
            style={{ '--i': 2 } as CSSProperties}
            className="absolute -bottom-14 right-0 w-[62%] sm:-bottom-24"
          >
            <div>
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
      {descriptionBelowImage ? (
        <p className="mt-6 border-l-2 border-brass-300/50 pl-4 text-base leading-relaxed text-mist-300 sm:text-lg">
          {description}
        </p>
      ) : null}
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

      {flowCategories ? (
        <div className="mt-14 border-t border-ink-600 pt-4 sm:pt-6">
          {flowImages ? (
            <EventFlow images={flowImages} mainFrameRef={mainFrameRef} reduced={reduced} />
          ) : null}
        </div>
      ) : gallery && gallery.length > 0 ? (
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
