package ophan

import com.gu.ophan.FileRecordStore
import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import com.gu.ophan.newUuidV4
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.device.DeviceClass
import ophan.thrift.event.Platform
import ophan.thrift.event.Url
import ophan.thrift.nativeapp.*

private const val GUARDIAN_DOMAIN = "theguardian.com"

@Suppress("unused")
class OphanApi(private val dispatcher: OphanDispatcher) {

    constructor(
            appFamily: String,
            appVersion: String,
            appOsVersion: String,
            deviceName: String,
            deviceManufacturer: String,
            deviceClass: DeviceClass?,
            deviceId: String,
            userId: String?,
            logger: Logger,
            recordStorePath: String
    ) : this(OphanDispatcher(
            App(
                    version = appVersion,
                    family = appFamily,
                    os = appOsVersion,
                    edition = Edition.UK,
                    platform = Platform.EDITIONS
            ),
            Device(
                    name = deviceName,
                    manufacturer = deviceManufacturer,
                    deviceClass = deviceClass
            ),
            deviceId,
            userId,
            logger,
            FileRecordStore(recordStorePath),
            false
    ))

    private fun newComponentEventDetails(
            componentType: ComponentType,
            action: Action,
            componentId: String?,
            value: String?
    ) = ComponentEvent.Builder()
            .component(ComponentV2.Builder()
                    .componentType(componentType)
                    .id(componentId)
                    .products(emptySet())
                    .campaignCode(null)
                    .labels(emptySet())
                    .build()
            )
            .action(action)
            .value(value)
            .build()

    private fun sendComponentEvent(viewId: String?, componentEventDetails: ComponentEvent) {
        val event = Event.Builder()
                .eventId(newUuidV4())
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(viewId)
                .componentEvent(componentEventDetails)
                .build()

        dispatcher.dispatchEvent(event)
    }

    fun sendAppScreenEvent(viewId: String?, screenName: String, value: String?) {
        val componentEventDetails = newComponentEventDetails(
                componentType = ComponentType.APP_SCREEN,
                action = Action.VIEW,
                componentId = screenName,
                value = value
        )
        sendComponentEvent(viewId, componentEventDetails)
    }

    fun sendComponentEvent(viewId: String?, componentType: String, action: String, value: String?, componentId: String?) {
        val componentEventDetails = newComponentEventDetails(
                componentType = ComponentType.valueOf(componentType),
                action = Action.valueOf(action),
                componentId = componentId,
                value = value
        )
        sendComponentEvent(viewId, componentEventDetails)
    }

    /**
     * Send a page view event to Ophan for the given [path]. Returns the newly generated `viewId`
     * of the page view for later use.
     */
    fun sendPageViewEvent(path: String): String {
        val viewId = newUuidV4()
        val host = "www.$GUARDIAN_DOMAIN"
        val validPath = "/" + path.removePrefix("/")
        val raw = "https://$host$validPath"

        val url = Url.Builder()
                .raw(raw)
                .host(host)
                .path(validPath)
                .domain(GUARDIAN_DOMAIN)
                .build()

        val event = Event.Builder()
                .eventId(newUuidV4())
                .eventType(EventType.VIEW)
                .viewId(viewId)
                .path(validPath)
                .url(url)
                .build()

        dispatcher.dispatchEvent(event)
        return viewId
    }
}