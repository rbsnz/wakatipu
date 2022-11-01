
export default {
    template: /*html*/`
        <header>
            <div class="title">
                <router-link to="/" class="title-link">
                    Wakatipu Boat Adventure
                </router-link>
            </div>
            <nav>
                <ul>
                    <li><router-link to="/seats">Booking</router-link></li>
                </ul>
            </nav>
        </header>
        <main class="centered">
            <router-view></router-view>
        </main>
        <footer>
            <ul>
                <li>Documentation</li>
                <li><a href="/documentation/part1.pdf">Part 1</a></li>
                <li><a href="/documentation/part2.pdf">Part 2</a></li>
            </ul>
        </footer>
        <!-- Background video -->
        <div class="bg-video-container">
            <video loop muted disablePictureInPicture autoplay playbackRate="0.75">
                <source
                    src="/media/drone-flying-over-a-lake-with-a-smooth-surface-3259896.mp4"
                    type="video/mp4"
                >
            </video>
            <div class="overlay-parent"></div>
        </div>
    `
}