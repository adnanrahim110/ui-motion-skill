'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useMotionPolicy } from './motion-policy';
import { trackScrollProgress } from './scroll-timeline';

export type StoryStep = {
  id: string;
  title: string;
  content: ReactNode;
};

export type ScrollStoryProps = {
  title: string;
  introduction: string;
  steps: readonly [StoryStep, ...StoryStep[]];
};

export function ScrollStory({ title, introduction, steps }: ScrollStoryProps) {
  const id = useId();
  const story = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const { reduced, wide } = useMotionPolicy();

  useEffect(() => {
    if (reduced || !wide || !story.current || !progress.current) return;
    return trackScrollProgress(progress.current, { target: story.current });
  }, [reduced, wide]);

  return (
    <section aria-labelledby={`${id}-title`} className="grid min-w-0 gap-8 py-8 lg:gap-12 xl:gap-16 2xl:gap-20">
      <header className="max-w-3xl">
        <h2 id={`${id}-title`} className="break-words text-2xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-4 break-words text-zinc-800">{introduction}</p>
      </header>
      <div ref={story} className="grid min-w-0 items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12">
        <nav aria-label={`${title} steps`} className="relative min-w-0 md:sticky md:top-8 md:max-h-[calc(100dvh-4rem)] md:overflow-y-auto">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 overflow-hidden bg-zinc-200">
            {!reduced && wide && <div ref={progress} className="h-full origin-top bg-blue-800" />}
          </div>
          <ol className="grid gap-4 pl-4">
            {steps.map((step, index) => (
              <li key={step.id}>
                <a href={`#${encodeURIComponent(`${id}-step-${index}`)}`} className="inline-flex min-h-12 min-w-12 items-center break-words rounded-lg px-4 py-3 font-medium text-zinc-800 hover:bg-zinc-100 hover:text-blue-900 active:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                  {index + 1}. {step.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="grid min-w-0 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <section key={step.id} id={`${id}-step-${index}`} aria-labelledby={`${id}-heading-${index}`} tabIndex={-1} className="min-w-0 scroll-mt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
              <h3 id={`${id}-heading-${index}`} className="break-words text-xl font-semibold text-zinc-950">{step.title}</h3>
              <div className="mt-4 min-w-0 text-zinc-800">{step.content}</div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
