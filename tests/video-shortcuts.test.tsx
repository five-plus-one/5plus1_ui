import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { VideoPlayer } from '../src/lib';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('seeks within video bounds and adjusts volume and mute from the focused player', () => {
  render(<VideoPlayer src="lesson.mp4" />);
  const host=screen.getByRole('region'), video=host.querySelector('video')!;
  Object.defineProperty(video,'duration',{configurable:true,value:100});
  video.currentTime=98;
  fireEvent.keyDown(host,{key:'ArrowRight'}); expect(video.currentTime).toBe(100);
  fireEvent.keyDown(host,{key:'j'}); expect(video.currentTime).toBe(90);
  fireEvent.keyDown(host,{key:'3'}); expect(video.currentTime).toBe(30);
  fireEvent.keyDown(host,{key:'Home'}); expect(video.currentTime).toBe(0);
  fireEvent.keyDown(host,{key:'ArrowLeft'}); expect(video.currentTime).toBe(0);
  fireEvent.keyDown(host,{key:'ArrowDown'}); expect(video.volume).toBeCloseTo(.95);
  fireEvent.keyDown(host,{key:'m'}); expect(video.muted).toBe(true);
  fireEvent.keyDown(host,{key:'ArrowUp'}); expect(video.muted).toBe(false);
  expect(video.volume).toBe(1);
});
it('preserves control keys and supports opting out of shortcuts', () => {
  const view=render(<VideoPlayer src="lesson.mp4" />);
  const host=screen.getByRole('region'), video=host.querySelector('video')!;
  const play=vi.spyOn(video,'play').mockResolvedValue(undefined);
  fireEvent.keyDown(host,{key:' '}); expect(play).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(host,{key:' ',repeat:true}); expect(play).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(screen.getByRole('slider',{name:'播放进度'}),{key:'ArrowRight'});
  expect(video.currentTime).toBe(0);
  fireEvent.keyDown(host,{key:'k',ctrlKey:true}); expect(play).toHaveBeenCalledTimes(1);
  view.rerender(<VideoPlayer src="lesson.mp4" keyboardShortcuts={false}/>);
  fireEvent.keyDown(host,{key:'k'}); expect(play).toHaveBeenCalledTimes(1);
});
it('keeps fullscreen failures separate from playback failures',async()=>{
  const error=vi.fn();render(<VideoPlayer src="lesson.mp4" onPlaybackError={error}/>);
  const host=screen.getByRole('region');Object.defineProperty(host,'requestFullscreen',{value:vi.fn().mockRejectedValue(new Error('denied'))});
  fireEvent.click(screen.getByRole('button',{name:'全屏'}));
  expect(await screen.findByRole('status')).toHaveTextContent('暂时无法进入全屏');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();expect(error).not.toHaveBeenCalled();
});
