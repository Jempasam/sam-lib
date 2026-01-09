/**
 * A audio buffer decorator that add some operations to manipulate audio buffers.
 *
 * @example
 * // You can operate on any AudioBuffer:
 * val buffer = OperableAudioBuffer.make(audioBuffer)
 * buffer.reverse()
 *
 * // You can directly create a new OperableAudioBuffer:
 * val buffer = OperableAudioBuffer.create({numberOfChannels: 2, length: 44100, sampleRate: 44100})
 *
 * // You can operate on a subpart of an AudioBuffer:
 * val buffer = OperableAudioBuffer.view(audioBuffer, 1000, 10000)
 * buffer.reverse()
 *
 * // You can also use the buffer as a normal AudioBuffer:
 * val buffer = OperableAudioBuffer.create({numberOfChannels: 2, length: 44100, sampleRate: 44100})
 * buffer.copyToChannel(new Float32Array(44100), 0)
 *
 * @author Samuel DEMONT
 *
 */
export default abstract class OperableAudioBuffer implements AudioBuffer {
    /** FACTORIES */
    protected constructor();
    /**
     * Create a new OperableBuffer with its audio buffer.
     * @param options The options to create the buffer.
     * @returns The new OperableBuffer.
     */
    static create(options: ConstructorParameters<typeof AudioBuffer>[0]): BufferOperableAudioBuffer;
    /**
     * Create a new OperableBuffer for a given AudioBuffer.
     * @param audio The audio buffer to wrap.
     * @returns The new OperableBuffer.
     */
    static make(audio: AudioBuffer): BufferOperableAudioBuffer;
    /**
     * Create a new OperableBuffer for a subpart of an AudioBuffer.
     * The new operablebuffer share the same data as the original buffer.
     * @param audio The audio buffer to wrap.
     * @param start The start index of the subpart.
     * @param length The length of the subpart.
     * @returns The new OperableBuffer.
     * @throws {RangeError} If the subpart is out of bound.
     */
    static view(audio: AudioBuffer, start: number, length?: number): SubOperableAudioBuffer;
    /** ABSTRACT METHODS */
    /** Get the length of the buffer in samples. */
    abstract get length(): number;
    /** Get the sample rate of the buffer. */
    abstract get sampleRate(): number;
    /** Get the number of channels of the buffer. */
    abstract get numberOfChannels(): number;
    /** Get the data of a channel. */
    abstract getChannelData(channel: number): Float32Array<ArrayBuffer>;
    /**
     * Copy data from a channel of the buffer.
     * @param destination The destination buffer to copy to.
     * @param channelNumber The channel number to copy from.
     * @param bufferOffset The optional offset of the channel source buffer to start copying from.
     */
    copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number | undefined): void;
    /**
     * Copy data to a channel of the buffer.
     * @param source The source data to copy.
     * @param channelNumber The channel number to copy to.
     * @param bufferOffset An optional offset in the buffer.
     */
    copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number | undefined): void;
    /** Get the duration of the audio buffer in milliseconds */
    get duration(): number;
    /** ESSENTIALS OPERATIONS */
    /**
     * Mix a source buffer into this buffer.
     * This buffer will keep its length and channel count.
     * @param {AudioBufferView} srcBuffer The source buffer.
     */
    mix(srcBuffer: AudioBuffer): void;
    /**
     * Create a view on a subpart of this buffer.
     * @param start  The start index of the subpart.
     * @param length  The length of the subpart.
     * @returns
     */
    view(start: number, length?: number): SubOperableAudioBuffer;
    /**
     * Modify this buffer by applying a map function to each sample.
     * @param map The function to apply to each sample.
     */
    apply(map: (value: number, index: number, channel: number) => number): void;
    /** SHORTCUT OPERATIONS */
    /**
     * Clone this buffer.
     * @returns
     */
    clone(): BufferOperableAudioBuffer;
    /**
     * Merge two buffer into a new buffer.
     * Work like mix, but the merged buffer is a new buffer and has enough length and channels to contain both buffer.
     * @param {AudioBuffer} that The buffer to merge with.
     * @param {number} start_offset The offset between the start of this buffer and the start of that buffer. It can be negative.
     */
    merge(that: AudioBuffer, start_offset?: number): BufferOperableAudioBuffer;
    /**
     * Concatenate two buffer into a new buffer.
     * With just enough channels and length to contain both buffer.
     * @param {AudioBuffer} that
     * @param {number} [numberOfChannels]
     */
    concat(that: AudioBuffer): BufferOperableAudioBuffer;
    /**
     * Reverse the buffer in time.
     */
    reverse(): void;
    /**
     * Invert the buffer in amplitude.
     */
    inverse(): void;
    /**
     * Split the buffer into two buffer at a given index.
     * @param {number} position in sample
     */
    split(position: number): BufferOperableAudioBuffer[];
    /**
     * @param {number} channel
     * @param {number} index
     * @param {number} value
     */
    write(channel: number, index: number, value: number): void;
    /**
     * Copy the content of this buffer into an array.
     * @param shared Is the created buffer a SharedArrayBuffer if supported.
     * @returns
     */
    toArray(shared?: boolean): Float32Array<ArrayBuffer>[];
    /**
     * Return a new stereo buffer with the same content.
     * If this buffer is already stereo or more, return this buffer.
     * Else return a new stereo buffer with the same content by duplicating the mono channel.
     * @returns {OperableAudioBuffer}
     */
    makeStereo(): this | BufferOperableAudioBuffer;
}
declare class BufferOperableAudioBuffer extends OperableAudioBuffer {
    private buffer;
    constructor(buffer: AudioBuffer);
    get length(): number;
    get sampleRate(): number;
    get numberOfChannels(): number;
    getChannelData(channel: number): Float32Array<ArrayBufferLike>;
}
declare class SubOperableAudioBuffer extends OperableAudioBuffer {
    private buffer;
    private new_start;
    new_length: number;
    constructor(buffer: AudioBuffer, new_start: number, new_length?: number);
    get length(): number;
    get sampleRate(): number;
    get numberOfChannels(): number;
    getChannelData(channel: number): Float32Array<ArrayBufferLike>;
}
export {};
