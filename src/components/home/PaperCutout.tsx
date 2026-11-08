type PhotoId = 'backstage' | 'hiking' | 'xuegao'

// The outlines are traced in the original photograph's coordinates.
// Only the mask and its paper backing change; faces and fur stay photographic.
const cutouts = {
  backstage: {
    viewBox: '126 356 662 560', width: 1200, height: 900,
    outline: 'M147 900 L171 854 Q206 816 252 794 L307 760 Q322 727 321 683 L326 635 Q315 604 326 554 L326 509 Q323 456 360 427 Q395 389 451 386 L510 389 Q539 390 564 380 Q582 369 594 387 L614 419 Q632 447 640 477 L649 518 Q657 551 644 586 L632 623 L615 651 Q610 698 636 728 Q664 752 696 769 Q735 791 751 827 L774 899 L746 898 L720 902 L692 899 L664 903 L636 899 L607 902 L579 899 L551 903 L522 900 L493 903 L463 900 L434 903 L404 899 L375 902 L345 899 L315 903 L286 900 L256 903 L227 899 L198 902 L172 899 Z',
  },
  hiking: {
    viewBox: '157 551 312 260', width: 900, height: 1200,
    outline: 'M225 577 Q235 565 246 570 Q260 570 260 587 L257 601 L267 614 L286 618 L300 609 L308 609 L314 615 L309 624 L294 633 L277 638 L274 672 L290 681 L311 691 L342 710 L363 718 L376 709 L384 713 L382 724 L370 736 L355 744 L341 740 L310 733 L280 718 L276 746 L268 777 L266 786 L253 790 L250 795 L230 795 L229 788 L234 756 L236 724 L239 695 L228 690 L216 660 L205 668 L192 674 L180 676 L173 670 L177 663 L197 651 L211 629 L221 614 L224 602 L221 590 Z',
    pole: 'M307 617 L446 690',
  },
  xuegao: {
    viewBox: '292 174 418 735', width: 900, height: 1200,
    outline: 'M357 257 Q369 252 387 269 L405 286 Q437 265 471 261 L504 253 L538 258 L562 247 L581 260 L593 282 L603 310 L606 338 L599 372 L587 401 Q604 391 612 363 L614 314 L606 281 L607 249 L620 216 L641 191 L657 186 L672 200 L681 222 L682 250 L671 284 L678 324 L683 371 L677 420 L661 468 L645 515 L642 567 L627 623 L613 671 L606 710 L595 750 L590 775 L579 788 L560 787 L542 776 L526 750 L515 717 L501 688 L479 679 L459 687 L438 711 L417 735 L394 758 L381 787 L378 823 L365 867 L355 886 L340 891 L324 879 L313 864 L307 848 L315 822 L329 786 L336 750 L345 713 L355 680 L357 637 L358 598 L364 553 L372 510 L382 469 L383 442 L374 418 L358 392 L350 366 L347 341 L354 317 L358 301 L355 278 Z',
  },
} satisfies Record<PhotoId, { viewBox: string; width: number; height: number; outline: string; pole?: string }>

export function PaperCutout({ id, title }: { id: PhotoId; title: string }) {
  const shape = cutouts[id]
  const pole = 'pole' in shape ? shape.pole : undefined
  const key = `paper-${id}`
  return <svg className="home-paper-cutout" viewBox={shape.viewBox} preserveAspectRatio="xMidYMin meet" role="img" aria-label={title}>
    <defs>
      <filter id={`${key}-edge`} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency=".14" numOctaves="3" seed="7" result="fibers" />
        <feDisplacementMap in="SourceGraphic" in2="fibers" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <mask id={`${key}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={shape.width} height={shape.height}>
        <path d={shape.outline} fill="white" />
        {pole && <path d={pole} fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />}
      </mask>
    </defs>
    <g fill="var(--paper)" stroke="var(--paper)" strokeWidth={id === 'hiking' ? 10 : 14} strokeLinejoin="round" filter={`url(#${key}-edge)`} aria-hidden="true">
      <path d={shape.outline} />
      {pole && <path d={pole} fill="none" strokeWidth="12" strokeLinecap="round" />}
    </g>
    <image href={`/home/photos/${id}.webp`} width={shape.width} height={shape.height} mask={`url(#${key}-mask)`} />
    <path className="home-paper-hit" d={shape.outline} fill="transparent" stroke="transparent" strokeWidth="18" />
    {pole && <path className="home-paper-hit" d={pole} fill="none" stroke="transparent" strokeWidth="14" />}
  </svg>
}
