<template>
    <div class="grad-create">
        <h1 style="margin: 0.75em;">Session erstellen</h1>
        <Loader v-if="loading" />
        <Error
            v-else-if="error"
            @button="fetchMaps"
            description="Feler beim Laden der Karten"
            button="Erneut versuchen!"
        />
        <template v-else>
            <input type="text" v-model="filter" placeholder="Karte suchen..." style="text-align: left; margin-bottom: 1em;" />
            <div style="display: flex; flex-wrap: wrap;" v-if="filteredMaps.length > 0">
                <MapItem
                    v-for="m in filteredMaps"
                    :key="m.id"
                    :model="m"
                    @click.native="create(m)"
                />
            </div>
            <Error
                v-else
                @button="fetchMaps"
                description="Deine Suche ergab leider keine Treffer"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { createSession } from '@/services';
import { Map, fetchMaps } from '@/services/maps';
import MapItemVue from '@/components/Create/MapItem.vue';

@Component({
    components: {
        MapItem: MapItemVue
    }
})
export default class CreateVue extends Vue {
    private maps: Map[] = [];
    private loading: boolean = true;
    private error?: any;
    private filter: string = '';

    private created() {
        this.fetchMaps();
    }

    /**
     * Fetch avaliable maps
     */
    private async fetchMaps() {
        this.loading = true;
        this.error = undefined;

        try {
            this.maps = (await fetchMaps()).sort((a, b) => a.displayName.localeCompare(b.displayName));
        } catch (err) {
            this.error = err;
        }

        this.loading = false;
    }

    private async create(map: Map) {
        const id = await createSession(map.id);

        this.$router.push(`/join/${id}`);
    }

    private get filteredMaps(): Map[] {
        const filter = this.filter.toLowerCase();

        return this.maps.filter(m => m.displayName.toLowerCase().includes(filter));
    }
}
</script>

<style lang="scss" scoped>
.grad-create {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    > * {
        width: 58.5rem;
        max-width: calc(100% - 2rem);
    }
}
</style>
