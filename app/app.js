import Booking from './page/booking.js'

export default {
    template: /*html*/`
        <!-- Header -->
        <header>
            <div class="title">
                <router-link to="/" class="title-link no-line">
                    Wakatipu Boat Adventure
                </router-link>
            </div>
            <nav>
            </nav>
        </header>
        <!-- Main content -->
        <main class="centered">
            <router-view v-slot="{ Component }">
                <transition name="v" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <!-- Footer -->
        <footer>
            <ul>
                <li>Documentation</li>
                <li><a href="documentation/part1.pdf" target="_blank">Part 1</a></li>
                <li><a href="documentation/part2.pdf" target="_blank">Part 2</a></li>
            </ul>
        </footer>
        <!-- Background video -->
        <div class="bg-video-container">
            <video loop muted disablePictureInPicture autoplay playbackRate="0.75">
                <source
                    src="media/drone-flying-over-a-lake-with-a-smooth-surface-3259896.mp4"
                    type="video/mp4"
                >
            </video>
            <div class="overlay-parent"></div>
        </div>
    `
}