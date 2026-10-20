import { useEffect, useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type RefAttributes } from 'react';
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popup } from './Popup';

const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function parseDate(value:string) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const date=new Date(value+'T12:00:00');return Number.isFinite(date.getTime())&&iso(date)===value?date:null; }
type StyledInputProps = InputHTMLAttributes<HTMLInputElement> & RefAttributes<HTMLInputElement>;
function useInputValue(props: StyledInputProps) {
  const [inner,setInner]=useState(String(props.defaultValue??''));
  const input=useRef<HTMLInputElement>(null);
  const value=String(props.value??inner);
  const change=(next:string)=>{
    setInner(next);
    if(input.current){
      input.current.value=next;
      const nativeEvent=new Event('change',{bubbles:true});
      props.onChange?.({target:input.current,currentTarget:input.current,nativeEvent,type:'change',bubbles:true,cancelable:false,defaultPrevented:false,eventPhase:3,isTrusted:false,timeStamp:nativeEvent.timeStamp,preventDefault:()=>nativeEvent.preventDefault(),stopPropagation:()=>nativeEvent.stopPropagation(),isDefaultPrevented:()=>nativeEvent.defaultPrevented,isPropagationStopped:()=>false,persist:()=>{}} as ChangeEvent<HTMLInputElement>);
    }
  };
  const bind = (node: HTMLInputElement | null) => { input.current = node; if (typeof props.ref === 'function') props.ref(node); else if (props.ref) props.ref.current = node; };
  useEffect(() => { const form = input.current?.form; const reset = () => setInner(String(props.defaultValue ?? '')); form?.addEventListener('reset', reset); return () => form?.removeEventListener('reset', reset); }, [props.defaultValue]);
  return {input,bind,value,change};
}
export function DatePicker(props:StyledInputProps){
  const {input,bind,value,change}=useInputValue(props);
  const base=parseDate(value)||new Date();
  const [month,setMonth]=useState(new Date(base.getFullYear(),base.getMonth(),1));
  const year=month.getFullYear(),m=month.getMonth(),disabled=props.disabled||props.readOnly;
  const allowed=(day:string)=>(!props.min||day>=String(props.min))&&(!props.max||day<=String(props.max));
  useEffect(()=>{input.current?.setCustomValidity(value&&(!parseDate(value)||!allowed(value))?'请填写有效范围内的日期':'');},[value,props.min,props.max]);
  return <span className={`fp-date-field ${props.className||''}`}><input {...props} ref={bind} className="fp-input" type="text" value={value} defaultValue={undefined} placeholder={props.placeholder||'YYYY-MM-DD'} onChange={e=>change(e.target.value)} />
    <Popup label="选择日期" disabled={disabled} trigger={<CalendarDays size={17}/>} className="fp-date-popup" onOpenChange={open=>{if(open)setMonth(new Date(base.getFullYear(),base.getMonth(),1));}}>{close=><div className="fp-calendar">
      <header><button type="button" aria-label="上个月" onClick={()=>setMonth(new Date(year,m-1,1))}><ChevronLeft size={17}/></button><strong>{year} 年 {m+1} 月</strong><button type="button" aria-label="下个月" onClick={()=>setMonth(new Date(year,m+1,1))}><ChevronRight size={17}/></button></header>
      <div className="fp-calendar-grid" role="group" aria-label="日期">{'日一二三四五六'.split('').map(day=><span key={day}>{day}</span>)}{Array.from({length:new Date(year,m,1).getDay()},(_,i)=><span key={'blank'+i}/>)}{Array.from({length:new Date(year,m+1,0).getDate()},(_,i)=>{const day=iso(new Date(year,m,i+1));return <button type="button" key={day} data-date={day} aria-label={day} aria-pressed={value===day} disabled={!allowed(day)} onClick={()=>{change(day);close();}} onKeyDown={event=>{
        const offset=({ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7} as Record<string,number>)[event.key];if(!offset)return;event.preventDefault();const next=new Date(year,m,i+1+offset),key=iso(next),root=event.currentTarget.closest('.fp-calendar');setMonth(new Date(next.getFullYear(),next.getMonth(),1));requestAnimationFrame(()=>root?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus());
      }}>{i+1}</button>;})}</div>
      <footer><button type="button" disabled={props.required} onClick={()=>{change('');close();}}>清除</button><button type="button" disabled={!allowed(iso(new Date()))} onClick={()=>{change(iso(new Date()));close();}}>今天</button></footer>
    </div>}</Popup></span>;
}
export function TimePicker(props:StyledInputProps){
  const {input,bind,value,change}=useInputValue(props),[hour,minute]=value.split(':');
  useEffect(()=>{input.current?.setCustomValidity(value&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)||(props.min&&value<String(props.min))||(props.max&&value>String(props.max)))?'请填写有效范围内的时间':'');},[value,props.min,props.max]);
  return <span className={`fp-date-field ${props.className||''}`}><input {...props} ref={bind} className="fp-input" type="text" value={value} defaultValue={undefined} placeholder={props.placeholder||'HH:mm'} onChange={e=>change(e.target.value)}/><Popup label="选择时间" disabled={props.disabled||props.readOnly} trigger={<Clock size={17}/>} className="fp-time-popup">{close=><div><div className="fp-time-columns">{[['小时',24,hour],['分钟',60,minute]].map(([label,count,current],column)=><div key={label} role="group" aria-label={String(label)}>{Array.from({length:Number(count)},(_,i)=>{const text=String(i).padStart(2,'0'),candidate=column===0?`${text}:${minute||'00'}`:`${hour||'00'}:${text}`,next=column===0?(props.min&&candidate<String(props.min)?String(props.min):props.max&&candidate>String(props.max)?String(props.max):candidate):candidate,allowed=column===0?(!props.min||`${text}:59`>=String(props.min))&&(!props.max||`${text}:00`<=String(props.max)):(!props.min||next>=String(props.min))&&(!props.max||next<=String(props.max));return <button type="button" key={text} aria-pressed={current===text} disabled={!allowed} onClick={()=>change(next)}>{text}</button>;})}</div>)}</div><footer><button type="button" onClick={close}>完成</button></footer></div>}</Popup></span>;
}
export function ColorPicker({label,value,onChange,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;disabled?:boolean}){
  const [draft,setDraft]=useState(value);const colors=['#FD8B07','#B85E00','#1A73E8','#13795B','#7252C7','#D44A61','#202124','#FFFFFF'];
  useEffect(()=>setDraft(value),[value]);
  const valid=/^#[0-9a-f]{6}$/i.test(value)?value:'#FD8B07';
  const channel=(index:number)=>parseInt(valid.slice(index*2+1,index*2+3),16);
  const id=useId();
  return <div className="fp-color-field"><span>{label}</span><Popup disabled={disabled} label={label} trigger={<><i className="fp-color-swatch" style={{background:valid}}/><code>{value}</code></>} className="fp-color-popup">{()=> <div><div className="fp-color-swatches">{colors.map(color=><button type="button" key={color} aria-label={color} aria-pressed={value.toLowerCase()===color.toLowerCase()} style={{background:color}} onClick={()=>{setDraft(color);onChange(color);}}/>)}</div>{['红','绿','蓝'].map((name,index)=><label className="fp-color-channel" key={name}>{name}<input type="range" aria-label={name} min={0} max={255} value={channel(index)} onChange={event=>{const parts=[channel(0),channel(1),channel(2)];parts[index]=Number(event.target.value);const color='#'+parts.map(part=>part.toString(16).padStart(2,'0')).join('');setDraft(color);onChange(color);}}/><output>{channel(index)}</output></label>)}<label htmlFor={id}>HEX</label><input id={id} className="fp-input" aria-label="十六进制颜色" value={draft} onFocus={()=>setDraft(value)} onChange={event=>{setDraft(event.target.value);if(/^#[0-9a-f]{6}$/i.test(event.target.value))onChange(event.target.value);}}/></div>}</Popup></div>;
}
