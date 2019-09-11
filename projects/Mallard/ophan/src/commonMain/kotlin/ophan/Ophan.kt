package ophan

import com.gu.ophan.FileRecordStore
import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
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
            deviceId: String,
            userId: String?,
            logger: Logger,
            recordStorePath: String
    ) : this(OphanDispatcher(
            App(
                    version = appVersion,
                    family = appFamily,
                    os = appOsVersion,
                    edition = Edition.UK
            ),
            Device(
                    name = deviceName,
                    manufacturer = deviceManufacturer
            ),
            deviceId,
            userId,
            logger,
            FileRecordStore(recordStorePath),
            true
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

    private fun sendComponentEvent(eventId: String, componentEventDetails: ComponentEvent) {
        val event = Event.Builder()
                .eventId(eventId)
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(null) /* TODO */
                .componentEvent(componentEventDetails)
                .build()

        dispatcher.dispatchEvent(event)
    }

    fun sendAppScreenEvent(screenName: String, value: String?, eventId: String) {
        val componentEventDetails = newComponentEventDetails(
                componentType = ComponentType.APP_SCREEN,
                action = Action.VIEW,
                componentId = screenName,
                value = value
        )
        sendComponentEvent(eventId, componentEventDetails)
    }

    fun sendComponentEvent(componentType: String, action: String, eventId: String, value: String?, componentId: String?) {
        val componentEventDetails = newComponentEventDetails(
                componentType = ComponentType.valueOf(componentType),
                action = Action.valueOf(action),
                componentId = componentId,
                value = value
        )
        sendComponentEvent(eventId, componentEventDetails)
    }

    fun sendPageViewEvent(path: String, eventId: String) {
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
                .eventId(eventId)
                .eventType(EventType.VIEW)
                .viewId(eventId)
                .path(validPath)
                .url(url)
                .build()

        dispatcher.dispatchEvent(event)
    }
}