import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: HTMLImageElement) {
        // As of Version 15.6 (17613.3.9.1.5), Safari still has a bug where the
        // natural{Width,Height} are reported incorrectly for SVG images where a
        // CSS width/height has been set.  This was fixed in Blink in
        // https://bugs.chromium.org/p/chromium/issues/detail?id=396955 but not
        // in Apple's WebKit fork.
        // See: https://bugreports.qt.io/browse/QTBUG-47094
        // See: https://github.com/niklasvh/html2canvas/issues/2261
        // See: https://github.com/niklasvh/html2canvas/issues/2199

        // To retrieve the correct values, we must clone the element and strip
        // any styles that could influence it.
        const clone = img.ownerDocument.createElement('img') as HTMLImageElement;
        clone.loading = 'eager';
        clone.decoding = 'sync';
        clone.src = img.currentSrc || img.src;
        // This is not totally correct, because the image may not have loaded by
        // the time we query the natural{Width,Height}.
        const {naturalWidth, naturalHeight} = clone;
        super(context, img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = naturalWidth;
        this.intrinsicHeight = naturalHeight;
        this.context.cache.addImage(this.src);
    }
}
