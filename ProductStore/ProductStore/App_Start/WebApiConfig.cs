using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ProductStore
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}.aspx/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
