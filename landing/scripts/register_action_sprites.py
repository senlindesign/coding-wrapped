#!/usr/bin/env python3
"""Cut out and anchor genuine multi-pose story frames without flattening motion."""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
from PIL import Image

FRAME=512
SHEET=(1536,1024)

def cutout(frame: Image.Image) -> Image.Image:
    rgb=np.asarray(frame.convert('RGB'),dtype=np.uint8)
    red,green,blue=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
    # Generated paper varies slightly between cells. Key the complete warm-paper
    # family rather than a single sampled color, while preserving saturated fills
    # and every dark pixel-art outline.
    paper=(red>=238)&(green>=220)&(green<=247)&(blue>=210)&(blue<=240)&((red.astype(np.int16)-green)<=25)&((green.astype(np.int16)-blue)<=20)
    alpha=np.where(paper,0,255).astype(np.uint8)
    rgba=np.dstack([rgb,alpha])
    rgba[rgba[:,:,3]==0,:3]=0
    return Image.fromarray(rgba,'RGBA')

def split(sheet:Image.Image)->list[Image.Image]:
    return [cutout(sheet.crop(((i%3)*FRAME,(i//3)*FRAME,(i%3+1)*FRAME,(i//3+1)*FRAME))) for i in range(6)]

def alpha_bbox(frame:Image.Image,threshold:int=180)->tuple[int,int,int,int]:
    a=np.asarray(frame.getchannel('A'))
    ys,xs=np.where(a>=threshold)
    return (int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))

def translate(frame:Image.Image,dx:int,dy:int)->Image.Image:
    out=Image.new('RGBA',(FRAME,FRAME))
    out.alpha_composite(frame,(dx,dy))
    return out

def anchor(frames:list[Image.Image],kind:str)->list[Image.Image]:
    boxes=[alpha_bbox(f) for f in frames]
    if kind=='process':
        # The center module/feet baseline is present throughout the sequence.
        target_bottom=416
        target_center=256
    else:
        # Desk, chair wheels and robot feet define a stable camera across all poses.
        target_bottom=458
        target_center=282
    result=[]
    for frame,(x1,y1,x2,y2) in zip(frames,boxes):
        dx=round(target_center-(x1+x2)/2)
        dy=target_bottom-y2
        result.append(translate(frame,dx,dy))
    return result

def semantic_boxes(frame:Image.Image,kind:str)->dict[str,tuple[int,int,int,int] | None]:
    rgba=np.asarray(frame)
    rgb=rgba[:,:,:3]
    opaque=rgba[:,:,3]>=180
    yy,xx=np.indices(opaque.shape)
    dark=opaque&(rgb[:,:,0]<72)&(rgb[:,:,1]<68)&(rgb[:,:,2]<64)
    if kind=='process':
        left=dark&(xx<245)
        right=dark&(xx>245)
        return {'person':mask_box(left),'robot':mask_box(right)}
    desk=opaque&(yy>245)&(rgb[:,:,0]>92)&(rgb[:,:,0]<210)&(rgb[:,:,1]>45)&(rgb[:,:,1]<155)&(rgb[:,:,2]<105)
    return {'desk':mask_box(desk)}

def mask_box(mask:np.ndarray)->tuple[int,int,int,int] | None:
    ys,xs=np.where(mask)
    return None if not len(xs) else (int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))

def validate(frames:list[Image.Image],kind:str)->None:
    for index,frame in enumerate(frames):
        alpha=np.asarray(frame.getchannel('A'))
        if not (np.all(alpha[:6]==0) and np.all(alpha[-6:]==0) and np.all(alpha[:,:6]==0) and np.all(alpha[:,-6:]==0)):
            raise ValueError(f'{kind} frame {index}: transparent padding is missing')
    boxes=[alpha_bbox(f) for f in frames]
    bottoms=[box[3] for box in boxes]
    if max(bottoms)-min(bottoms)>1:
        raise ValueError(f'{kind}: baseline drift {bottoms}')
    semantics=[semantic_boxes(f,kind) for f in frames]
    if any(value is None for entry in semantics for value in entry.values()):
        raise ValueError(f'{kind}: could not find semantic anchors')
    # Guard against a future regression to six copies of one scene: meaningful
    # actors/furniture must change in size or position across the story.
    signatures={tuple(value for key in sorted(entry) for value in entry[key]) for entry in semantics}
    if len(signatures)<3:
        raise ValueError(f'{kind}: sequence lacks genuine pose changes')

def build(source:Path,destination:Path,kind:str)->None:
    sheet=Image.open(source).convert('RGB')
    if sheet.size!=SHEET: raise ValueError(f'expected {SHEET}, got {sheet.size}')
    frames=anchor(split(sheet),kind)
    validate(frames,kind)
    output=Image.new('RGBA',SHEET)
    for i,frame in enumerate(frames): output.alpha_composite(frame,((i%3)*FRAME,(i//3)*FRAME))
    destination.parent.mkdir(parents=True,exist_ok=True)
    output.save(destination,'WEBP',lossless=True,method=6)

def main():
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('destination',type=Path);p.add_argument('--kind',choices=('process','tips'),required=True)
    a=p.parse_args();build(a.source,a.destination,a.kind)
if __name__=='__main__':main()
